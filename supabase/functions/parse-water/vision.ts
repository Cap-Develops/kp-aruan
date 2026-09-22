/* Разбор протокола по изображению страницы - основной путь с 22.09.2026.
 *
 * Почему картинкой, а не текстом: браузерное распознавание требовало двух движков
 * и 26 МБ моделей, занимало полторы-две минуты и всё равно путало колонки.
 * Модель видит страницу целиком: сама связывает норматив с результатом, читает
 * «±» и рукописный текст, понимает отметку «нецентрализованное водоснабжение»
 * и берёт норматив из нужного столбца бланка (замеры 22.09.2026 в плане).
 */

const API = "https://api.anthropic.com/v1/messages";

/* Правила выверены на тех же протоколах, что и текстовый промпт, но короче:
   модель видит саму таблицу, поэтому про «варианты распознавания» говорить
   нечего, а про колонки и запрет выдумывать - тем более нужно. */
export const VISION_SYSTEM =
  `Ты разбираешь протоколы лабораторного анализа воды по изображению страницы.
Верни СТРОГО JSON без пояснений и markdown:
{"lab": "название лаборатории или null", "date": "дата отбора пробы или null",
 "sample": "место отбора или null",
 "rows": [{"n": номер строки из протокола или null, "group": "раздел таблицы или null",
 "name": "название показателя как в протоколе", "key": "ключ из списка ниже или null",
 "value": число или null, "below": число или null,
 "unit": "единица как в протоколе", "limit": "норматив как в протоколе или null"}]}

Ключи: ph, hardness, iron_total, iron_2, manganese, dry_residue, permanganate, turbidity,
color, ammonium, nitrates, nitrites, chlorides, sulfates, alkalinity, hydrocarbonates,
calcium, magnesium, silicon, hydrogen_sulfide, suspended. Нет подходящего - key: null.

Правила:
1. НЕ ВЫДУМЫВАЙ. Показателя нет в протоколе - строки нет. Не разобрать значение - value: null.
   Пустая строка лучше правдоподобного числа: по этим данным подбирают оборудование.
2. ПОГРЕШНОСТЬ. «4,55 ± 0,68» - это значение 4.55, погрешность отбрасывай.
3. НИЖЕ ПРЕДЕЛА. «менее 0,01», «не обнаружено», «отсутствие» - value: null, порог в "below"
   (для «не обнаружено» below: null).
4. КОЛОНКИ. Норматив и результат стоят рядом, порядок столбцов в протоколах разный - на
   положение не опирайся. Число с «±» - всегда результат. «менее 1,0» - результат, соседнее
   число норматив. «не более 1,5», «в пределах 6-9», «не допускается» - всегда норматив.
   Если в бланке отмечен вид водоснабжения (централизованное или нецентрализованное),
   норматив бери из отмеченного столбца.
5. ПОЛНОТА. Верни ВСЕ строки таблицы результатов, включая те, где название разорвано
   переносом («Массовая концентрация сульфат-» / «ионов»). Бактериологию и радиологию
   возвращай с key: null.
6. ЧИСЛА. Десятичную запятую заменяй точкой, пробелы внутри чисел убирай: «1 423» -> 1423.
7. ПОРЯДОК. Строки в том же порядке, что в протоколе.
8. РУКОПИСЬ. Значения могут быть вписаны от руки. Читай их, но если цифра неоднозначна -
   value: null, чтобы человек вписал сам.
9. Если страниц несколько, разбирай только таблицу результатов испытаний; титульный лист,
   перечень методик и приборов пропускай.`;

export interface VisionResult {
  parsed: any;
  model: string;
  usage: unknown;
}

/** Один заход к Claude с картинками страниц. */
export async function askVision(key: string, model: string, images: string[], system: string) {
  const content: unknown[] = images.map((url) => {
    const [head, data] = String(url).split(",");
    const media = /data:([^;]+);/.exec(head)?.[1] ?? "image/jpeg";
    return { type: "image", source: { type: "base64", media_type: media, data } };
  });
  content.push({ type: "text", text: "Разбери показатели с этой страницы протокола." });

  const r = await fetch(API, {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    // размышления отключены намеренно: на трудном снимке модель уходила в них,
    // съедала лимит ответа и 150 секунд, отведённые функции
    body: JSON.stringify({
      model,
      max_tokens: 8192,
      thinking: { type: "disabled" },
      system,
      messages: [{ role: "user", content }],
    }),
  });

  const raw = await r.text();
  if (!r.ok) {
    const err: any = new Error(`Claude ответил ${r.status}: ${raw.slice(0, 200)}`);
    err.status = r.status;
    throw err;
  }
  const payload = JSON.parse(raw);
  const answer = (payload?.content ?? []).map((b: any) => b?.text ?? "").join("");
  return { answer, model: payload?.model ?? model, usage: payload?.usage ?? null };
}

/** Дешёвый вопрос к младшей модели: на какой странице таблица результатов.
 *  Шесть страниц одним куском стоили 10,6 ₽ против 2,5 ₽ за нужную одну. */
export async function pickPage(key: string, thumbs: string[]): Promise<number[]> {
  const { answer } = await askVision(
    key,
    "claude-haiku-4-5-20251001",
    thumbs,
    `Тебе даны страницы протокола анализа воды по порядку. Найди те, где таблица
РЕЗУЛЬТАТОВ испытаний с числами. Титульный лист, перечень методик и приборов,
подписи и приложения - не нужны. Ответь СТРОГО JSON: {"pages": [номера с 1]}.
Если таблица одна - верни одну страницу.`,
  );
  try {
    const m = /\{[\s\S]*\}/.exec(answer);
    const got = m ? JSON.parse(m[0]) : null;
    const pages = (got?.pages ?? []).filter((n: unknown) => Number.isInteger(n) && (n as number) > 0);
    return pages.length ? pages : [1];
  } catch {
    return [1];
  }
}
