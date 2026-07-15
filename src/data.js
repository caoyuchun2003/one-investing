/**
 * @typedef {{
 *   id: string,
 *   text: string,
 *   author: string,
 *   source: string,
 *   meaning: string,
 *   pitfall: string,
 *   ask: string,
 *   relatedId?: string,
 *   personaId?: string,
 *   note?: string,
 * }} Quote
 *
 * @typedef {{ id: string, name: string, blurb: string }} Persona
 */

export async function loadData() {
  const [quotesRes, scheduleRes, authorsRes] = await Promise.all([
    fetch('/data/quotes.json'),
    fetch('/data/schedule.json'),
    fetch('/data/authors.json'),
  ])
  if (!quotesRes.ok || !scheduleRes.ok) {
    throw new Error('无法加载金句数据')
  }
  const quotesFile = await quotesRes.json()
  const scheduleFile = await scheduleRes.json()
  const authorsFile = authorsRes.ok
    ? await authorsRes.json()
    : { personas: [] }

  /** @type {Quote[]} */
  const quotes = (quotesFile.quotes || []).map(normalizeQuote)
  const byId = Object.fromEntries(quotes.map((q) => [q.id, q]))
  /** @type {Persona[]} */
  const personas = authorsFile.personas || []
  return {
    quotes,
    byId,
    days: scheduleFile.days || {},
    personas,
  }
}

/** @param {Quote} raw */
function normalizeQuote(raw) {
  if (raw.meaning && raw.pitfall && raw.ask) return raw
  const note = raw.note || ''
  return {
    ...raw,
    meaning: note || '（待补本意）',
    pitfall: '别把金句当成买卖指令。',
    ask: '合上这句，你下一步研究什么？',
  }
}

export function todayKey(timeZone = 'Asia/Shanghai') {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

/**
 * @param {Record<string, string>} days
 * @param {Record<string, Quote>} byId
 * @param {Quote[]} quotes
 */
export function pickToday(days, byId, quotes) {
  const key = todayKey()
  const id = days[key]
  if (id && byId[id]) return { quote: byId[id], date: key, fromSchedule: true }
  const idx =
    Math.abs(Array.from(key).reduce((a, c) => a + c.charCodeAt(0), 0)) %
    quotes.length
  return { quote: quotes[idx], date: key, fromSchedule: false }
}

/**
 * @param {Quote} q
 * @param {Record<string, Quote>} byId
 * @param {Quote[]} quotes
 */
export function resolveRelated(q, byId, quotes) {
  if (q.relatedId && byId[q.relatedId] && q.relatedId !== q.id) {
    return byId[q.relatedId]
  }
  const samePersona = quotes.find(
    (x) => x.personaId && x.personaId === q.personaId && x.id !== q.id,
  )
  if (samePersona) return samePersona
  const sameAuthor = quotes.find(
    (x) => x.author === q.author && x.id !== q.id,
  )
  if (sameAuthor) return sameAuthor
  return quotes.find((x) => x.id !== q.id) || null
}

/** @param {Quote} q */
export function quoteHref(q) {
  return `/q.html?id=${encodeURIComponent(q.id)}`
}

/** @param {string} id */
export function authorHref(id) {
  return `/author.html?id=${encodeURIComponent(id)}`
}

/** @param {Quote} q */
export function renderRow(q) {
  return `<a class="quote-row" href="${quoteHref(q)}">
    <p class="q">${escapeHtml(q.text)}</p>
    <p class="sub">${escapeHtml(q.author)} · ${escapeHtml(q.source)}</p>
  </a>`
}

/**
 * @param {Persona[]} personas
 * @param {Quote[]} quotes
 */
export function renderPersonaWall(personas, quotes) {
  const counts = {}
  for (const q of quotes) {
    const id = q.personaId || 'proverbs'
    counts[id] = (counts[id] || 0) + 1
  }
  return personas
    .map((p) => {
      const n = counts[p.id] || 0
      return `<a class="persona-card" href="${authorHref(p.id)}">
        <span class="persona-name">${escapeHtml(p.name)}</span>
        <span class="persona-blurb">${escapeHtml(p.blurb)}</span>
        <span class="persona-count">${n} 条</span>
      </a>`
    })
    .join('')
}

/** @param {Quote} q */
export function renderHomeHero(q) {
  return `
    <p class="quote-text">「${escapeHtml(q.text)}」</p>
    <p class="meta">${escapeHtml(q.author)} · ${escapeHtml(q.source)}</p>
    <div class="note-block note-block--compact">
      <p class="note-label">读完这一问</p>
      <p class="note">${escapeHtml(q.ask)}</p>
    </div>
  `
}

/**
 * @param {Quote} q
 * @param {Quote | null} related
 */
export function renderDetailInner(q, related) {
  const relatedHtml = related
    ? `<aside class="related">
        <p class="related-label">相关金句</p>
        <a class="related-link" href="${quoteHref(related)}">
          <span class="related-text">「${escapeHtml(related.text)}」</span>
          <span class="related-meta">${escapeHtml(related.author)}</span>
        </a>
      </aside>`
    : ''

  return `
    <p class="quote-text">「${escapeHtml(q.text)}」</p>
    <p class="meta">${escapeHtml(q.author)} · ${escapeHtml(q.source)}</p>
    <div class="note-stack">
      <div class="note-block">
        <p class="note-label">本意</p>
        <p class="note">${escapeHtml(q.meaning)}</p>
      </div>
      <div class="note-block">
        <p class="note-label">易踩坑</p>
        <p class="note">${escapeHtml(q.pitfall)}</p>
      </div>
      <div class="note-block">
        <p class="note-label">读完这一问</p>
        <p class="note">${escapeHtml(q.ask)}</p>
      </div>
    </div>
    ${relatedHtml}
  `
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
