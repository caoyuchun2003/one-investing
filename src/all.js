import { loadData, renderRow } from './data.js'

const countEl = document.getElementById('all-count')
const list = document.getElementById('quote-list')

async function main() {
  try {
    const { quotes } = await loadData()
    countEl.textContent = `共 ${quotes.length} 条`
    list.innerHTML = quotes.map(renderRow).join('')
  } catch (e) {
    countEl.innerHTML = `<span class="err">${e.message || e}</span>`
  }
}

main()
