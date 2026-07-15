import { loadData, renderDetailInner } from './data.js'

const el = document.getElementById('quote-detail')
const id = new URLSearchParams(location.search).get('id')

async function main() {
  try {
    const { byId } = await loadData()
    const q = id && byId[id]
    if (!q) {
      el.innerHTML = `<p class="err">未找到该金句。</p>`
      document.title = '未找到 · 一句话投资'
    } else {
      el.innerHTML = renderDetailInner(q)
      document.title = `${q.text.slice(0, 24)}… · 一句话投资`
    }
  } catch (e) {
    el.innerHTML = `<p class="err">${e.message || e}</p>`
  }
}

main()
