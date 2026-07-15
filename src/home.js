import {
  loadData,
  pickToday,
  quoteHref,
  renderHomeHero,
  renderPersonaWall,
} from './data.js'

const todayCard = document.getElementById('today-card')
const personaGrid = document.getElementById('persona-grid')

async function main() {
  try {
    const { quotes, byId, days, personas } = await loadData()
    const { quote, date } = pickToday(days, byId, quotes)

    todayCard.innerHTML = `
    ${renderHomeHero(quote)}
    <p class="meta" style="margin-top:0.75rem;font-size:0.8rem">日程 ${date}</p>
    <a class="more" href="${quoteHref(quote)}">查看详解 →</a>
  `

    personaGrid.innerHTML = renderPersonaWall(personas, quotes)
  } catch (e) {
    todayCard.innerHTML = `<p class="err">${e.message || e}</p>`
  }
}

main()
