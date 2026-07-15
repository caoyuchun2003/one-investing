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

- `data/quotes.json` — 金句字段：`id/text/author/source/meaning/pitfall/ask/relatedId`
- `data/schedule.json` — `YYYY-MM-DD → id`（今日一句）

详情页展示「本意 / 易踩坑 / 读完这一问」+ 相关金句；首页今日一句只展示「读完这一问」。

改完后同步到 `public/data/`（构建读 public）：

```bash
cp data/*.json public/data/
```

## 赞赏码

可选放入：

- `public/pay-wechat.jpg`
- `public/pay-alipay.jpg`

## 部署

推送 `main` → GitHub Actions → Pages。DNS：`one` CNAME → `caoyuchun2003.github.io`，仓库 Pages 自定义域填 `one.yuchuntest.com`。
