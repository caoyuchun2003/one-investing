import {
  loadData,
  pickToday,
  quoteHref,
  renderDetailInner,
  renderRow,
} from './data.js'

const todayCard = document.getElementById('today-card')
const recentList = document.getElementById('recent-list')
const catalogList = document.getElementById('catalog-list')

async function main() {
  try {
    const { quotes, byId, days } = await loadData()
    const { quote, date } = pickToday(days, byId, quotes)

    todayCard.innerHTML = `
    ${renderDetailInner(quote)}
    <p class="meta" style="margin-top:0.75rem;font-size:0.8rem">日程 ${date}</p>
    <a class="more" href="${quoteHref(quote)}">查看单页 →</a>
  `

    const recent = [...quotes].slice(-20).reverse()
    recentList.innerHTML = recent.map(renderRow).join('')
    catalogList.innerHTML = [...quotes].map(renderRow).join('')
  } catch (e) {
    todayCard.innerHTML = `<p class="err">${e.message || e}</p>`
  }
}

main()
