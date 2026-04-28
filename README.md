# ボトルメーカー (`/bottle-maker`)

URLパラメータでページの見た目をカスタマイズできます。

| パラメータ | 説明 | 例 |
|---|---|---|
| `color` | テキスト・ボタンの色 | `color=9b59b6` |
| `bgcolor` | 背景色（背景画像を非表示にして単色に変更） | `bgcolor=f0e6ff` |
| `title` | プレビューエリアのタイトル文字 | `title=完成イメージ` |

`#` はあり・なしどちらでも動作します。

例: `/bottle-maker?color=9b59b6&bgcolor=f0e6ff&title=完成イメージ`

---

# デプロイ

`npm install -g vercel`
`vercel --token <トークン>`
`vercel login`
`vercel`

# Prisma スキーマ (prisma/schema.prisma) を編集する

`prisma/schema.prisma`

# マイグレーション

`yarn prisma migrate dev --name add-image-to-option`

# Prisma Client の再生成

`yarn prisma generate`
