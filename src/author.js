import { loadData, renderRow, escapeHtml } from './data.js'

const head = document.getElementById('list-head')
const list = document.getElementById('quote-list')
const id = new URLSearchParams(location.search).get('id')

async function main() {
  try {
    const { quotes, personas } = await loadData()
    const persona = personas.find((p) => p.id === id)
    if (!persona) {
      head.innerHTML = `<p class="err">未找到该人物。</p>`
      return
    }
    const subset = quotes.filter((q) => q.personaId === persona.id)
    document.title = `${persona.name} · 一句话投资`
    head.innerHTML = `
      <p class="eyebrow">人物</p>
      <h1>${escapeHtml(persona.name)}</h1>
      <p class="section-lead">${escapeHtml(persona.blurb)} · ${subset.length} 条</p>
    `
    list.innerHTML = subset.map(renderRow).join('')
  } catch (e) {
    head.innerHTML = `<p class="err">${e.message || e}</p>`
  }
}

main()
