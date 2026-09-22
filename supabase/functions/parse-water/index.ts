// Разбор протокола анализа воды -> показатели. Вызывается из конструктора.
//
// Основной путь с 22.09.2026: браузер присылает изображение страницы, разбирает
// Claude. Браузерное распознавание (tesseract.js + PaddleOCR, 26 МБ моделей,
// полторы-две минуты на протокол) снято: замеры показали, что модель по картинке
// читает лучше и быстрее, включая рукописные бланки и кривые фото.
//
// Запасной путь: GigaChat по тексту. Он работает там, где текст есть и без
// распознавания - PDF с текстовым слоем и документы Word. Для сканов запасного
// пути нет: разбирать нечего, честнее сказать об этом, чем отдать мусор.
// Ключ GigaChat живёт в проекте EchoFlow, за шлюзом; сюда он не попадает.
import { SYSTEM, buildUser } from "./prompt.ts";
import { VISION_SYSTEM, askVision, pickPage } from "./vision.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GATEWAY = "https://jreqglzifmkcshgkwrhh.supabase.co/functions/v1/ai-gateway";
const MODEL = "GigaChat-2-Max";        // младшая теряла строки таблицы от прогона к прогону
const VISION_MODEL = "claude-sonnet-5"; // Haiku дешевле вдвое, но врёт на рукописных бланках

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
  const cleaned = String(text).replace(/```json/gi, "").replace(/```/g, "");
  const from = cleaned.indexOf("{");
  if (from < 0) return null;
  const body = cleaned.slice(from);
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

/** Один заход к шлюзу GigaChat. */
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

/** Запасной разбор по тексту - когда картинки нет или Claude недоступен. */
async function byText(texts: string[], started: number, who?: string) {
  const user = buildUser(texts);
  if (user.length < 40) return json({ error: "Текст протокола пуст или слишком короткий" }, 400);

  const secret = Deno.env.get("AI_GATEWAY_SECRET");
  if (!secret) return json({ error: "AI_GATEWAY_SECRET не задан в секретах проекта" }, 500);

  let parsed: any = null;
  let used = MODEL;
  let usage = null;
  for (const model of [MODEL, "GigaChat-2"]) {
    let gw;
    try {
      gw = await ask(secret, model, SYSTEM, user);
    } catch (e) {
      if (model === "GigaChat-2") return json({ error: String(e) }, 502);
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
  return json({ ...parsed, ms: Date.now() - started, by: who, model: used, usage, engine: "gigachat" });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const gate = await checkManager(req);
    if (!gate.ok) return json({ error: "Нужен вход в конструктор" }, 401);

    const body = await req.json();
    const images: string[] = Array.isArray(body?.images) ? body.images : [];
    const texts: string[] = Array.isArray(body?.passes) ? body.passes : [];
    const started = Date.now();

    // служебный вызов: выбрать страницу с таблицей по эскизам, чтобы не платить
    // за разбор титульного листа и перечня методик
    if (body?.pick && images.length) {
      const key = Deno.env.get("ANTHROPIC_API_KEY");
      if (!key) return json({ pages: [1] });
      try {
        return json({ pages: await pickPage(key, images) });
      } catch {
        return json({ pages: [1] });   // не смогли выбрать - читаем первую
      }
    }

    if (images.length) {
      const key = Deno.env.get("ANTHROPIC_API_KEY");
      if (key) {
        try {
          const got = await askVision(key, body?.model || VISION_MODEL, images, VISION_SYSTEM);
          const parsed = repairJson(got.answer);
          if (parsed && Array.isArray((parsed as any).rows)) {
            return json({
              ...(parsed as any),
              ms: Date.now() - started,
              by: gate.who,
              model: got.model,
              usage: got.usage,
              engine: "claude",
            });
          }
        } catch (e) {
          // доступ отозван, лимит, сбой сети - падать нельзя, пробуем текст
          console.error("claude:", String(e));
        }
      }
      if (!texts.length) {
        return json({
          error: "Разбор по изображению сейчас недоступен. Попробуйте позже " +
                 "или загрузите протокол в виде PDF с текстом либо документа Word.",
          engine: "none",
        }, 503);
      }
    }

    return await byText(texts, started, gate.who);
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
