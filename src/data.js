/** @typedef {{ id: string, text: string, author: string, source: string, note: string }} Quote */

export async function loadData() {
  const [quotesRes, scheduleRes] = await Promise.all([
    fetch('/data/quotes.json'),
    fetch('/data/schedule.json'),
  ])
  if (!quotesRes.ok || !scheduleRes.ok) {
    throw new Error('无法加载金句数据')
  }
  const quotesFile = await quotesRes.json()
  const scheduleFile = await scheduleRes.json()
  /** @type {Quote[]} */
  const quotes = quotesFile.quotes || []
  const byId = Object.fromEntries(quotes.map((q) => [q.id, q]))
  return { quotes, byId, days: scheduleFile.days || {} }
}

/** Asia/Shanghai calendar date YYYY-MM-DD */
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
  // fallback: stable index from date
  const idx =
    Math.abs(
      Array.from(key).reduce((a, c) => a + c.charCodeAt(0), 0),
    ) % quotes.length
  return { quote: quotes[idx], date: key, fromSchedule: false }
}

/** @param {Quote} q */
export function quoteHref(q) {
  return `/q.html?id=${encodeURIComponent(q.id)}`
}

/** @param {Quote} q */
export function renderRow(q) {
  return `<a class="quote-row" href="${quoteHref(q)}">
    <p class="q">${escapeHtml(q.text)}</p>
    <p class="sub">${escapeHtml(q.author)} · ${escapeHtml(q.source)}</p>
  </a>`
}

/** @param {Quote} q */
export function renderDetailInner(q) {
  return `
    <p class="quote-text">「${escapeHtml(q.text)}」</p>
    <p class="meta">${escapeHtml(q.author)} · ${escapeHtml(q.source)}</p>
    <div class="note-block">
      <p class="note-label">注</p>
      <p class="note">${escapeHtml(q.note)}</p>
    </div>
  `
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
