// Разбор протокола анализа воды: распознанный текст -> показатели.
// Вызывается из конструктора после того, как браузер прочитал файл.
//
// К GigaChat напрямую не ходим: ключ живёт в проекте EchoFlow, туда же вынесен
// сертификат Минцифры и авторизация. Здесь - только проверка сотрудника,
// промпт и разбор ответа. Общий секрет двух серверов в браузер не попадает.
import { SYSTEM, buildUser } from "./prompt.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY = "https://jreqglzifmkcshgkwrhh.supabase.co/functions/v1/ai-gateway";
const MODEL = "GigaChat-2";          // замеры: этой модели достаточно, Max не нужен

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

/** Пускаем только сотрудников: нужен действующий вход и запись в managers. */
async function checkManager(req: Request): Promise<{ ok: boolean; who?: string }> {
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return { ok: false };
  const sb = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  const { data: user, error } = await sb.auth.getUser(token);
  if (error || !user?.user) return { ok: false };
  const { data: mgr } = await sb.from("managers").select("id,name").eq("user_id", user.user.id).single();
  return mgr ? { ok: true, who: mgr.name } : { ok: false };
}


/** Модель иногда ломает JSON на длинных ответах: обрываем по последней целой строке таблицы. */
function repairJson(text: string): unknown | null {
  const from = text.indexOf("{");
  if (from < 0) return null;
  const body = text.slice(from);
  try {
    return JSON.parse(body.slice(0, body.lastIndexOf("}") + 1));
  } catch { /* чиним ниже */ }
  const lastRow = body.lastIndexOf("},");
  if (lastRow < 0) return null;
  try {
    return JSON.parse(body.slice(0, lastRow + 1) + "]}");
  } catch {
    return null;
  }
}

/** Один заход к шлюзу. */
async function ask(secret: string, model: string, system: string, user: string) {
  const r = await fetch(GATEWAY, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-gateway-secret": secret },
    body: JSON.stringify({
      caller: "kp-constructor/parse-water",
      model,
      max_tokens: 8192,
      temperature: 0,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  const raw = await r.text();
  if (!r.ok) throw new Error(`Шлюз ответил ${r.status}: ${raw.slice(0, 200)}`);
  return JSON.parse(raw);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const gate = await checkManager(req);
    if (!gate.ok) return json({ error: "Нужен вход в конструктор" }, 401);

    const { passes } = await req.json();
    const texts: string[] = Array.isArray(passes) ? passes : [String(passes || "")];
    const user = buildUser(texts);
    if (user.length < 40) return json({ error: "Текст протокола пуст или слишком короткий" }, 400);

    const secret = Deno.env.get("AI_GATEWAY_SECRET");
    if (!secret) return json({ error: "AI_GATEWAY_SECRET не задан в секретах проекта" }, 500);

    const started = Date.now();

    // сначала дешёвая модель; если она вернула мусор вместо JSON - повторяем на старшей
    let parsed: any = null;
    let used = MODEL;
    let usage = null;
    for (const model of [MODEL, "GigaChat-2-Max"]) {
      let gw;
      try {
        gw = await ask(secret, model, SYSTEM, user);
      } catch (e) {
        if (model === "GigaChat-2-Max") return json({ error: String(e) }, 502);
        continue;
      }
      const candidate = repairJson(gw.answer ?? "");
      if (candidate && Array.isArray((candidate as any).rows) && (candidate as any).rows.length) {
        parsed = candidate;
        used = model;
        usage = gw.usage ?? null;
        break;
      }
    }
    if (!parsed) return json({ error: "Не удалось разобрать ответ модели" }, 502);

    return json({ ...parsed, ms: Date.now() - started, passes: texts.length, by: gate.who, model: used, usage });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
