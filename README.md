# 一句话投资

独立投资金句站：一句原文 + 一句作者注释。教育用途，非投资建议。

- 站点：https://one.yuchuntest.com/
- 作者：曹宇春

## 本地

```bash
npm i
npm run dev
npm run build
```

## 内容

- `data/quotes.json` — `id/text/author/source/meaning/pitfall/ask/relatedId/personaId`
- `data/authors.json` — 五主牌人物（巴菲特 / 格雷厄姆 / 马克斯 / 本站 / 谚语与常引）
- `data/schedule.json` — `YYYY-MM-DD → id`

首页：今日一句 + 人物墙。人物页 `author.html`，全部 `all.html`。详情：本意 / 易踩坑 / 读完这一问 + 相关金句。
## 赞赏码

可选放入：

- `public/pay-wechat.jpg`
- `public/pay-alipay.jpg`

## 部署

推送 `main` → GitHub Actions → Pages。DNS：`one` CNAME → `caoyuchun2003.github.io`，仓库 Pages 自定义域填 `one.yuchuntest.com`。
