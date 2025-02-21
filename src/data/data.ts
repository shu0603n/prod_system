export type PriceRange = {
  minQuantity: number
  maxQuantity: number | null
  price: number
}

export type Product = {
  name: string
  image: string
  led: string
  alcohol: string
  volume: string
  origin: string
  varieties: { name: string; description: string }[]
  description?: string
  priceRanges: PriceRange[]
}

export type Option = {
  name: string
  price: number
}

export type Order = {
  product: Product | null
  quantity: number
  options: Option[]
}

export const options: Option[] = [
  { name: "なし", price: 0 },
  { name: "LEDライト", price: 300 },
  { name: "キャップシール変更", price: 300 },
  { name: "アクリルキーホルダー", price: 300 },
]

export const stepTexts = [
  "商品を選択してください",
  "本数を入力してください",
  "オプションを選択してください",
  "合計金額を確認してください",
  "注文を追加しますか？",
]

export const products: Product[] = [
  {
    name: "バーロワイヤル",
    image:
      "/bottles/BarRoyal.png?height=300&width=200",
    led: "LED対応",
    alcohol: "度数：3.9%",
    volume: "内容量：750ml",
    origin: "原産国：ドイツ",
    varieties: [
      { name: "甘口マンゴー (alc 3.9%)", description: "マンゴーの繊細な果実感があり飲みやすい。" },
      { name: "甘口レモン (alc 3.9%)", description: "レモンの清涼感、爽やかさと果実感。" },
      { name: "甘口ストロベリー (alc 3.9%)", description: "イチゴの果実感と甘酸っぱさ。" },
      { name: "甘口ピーチ (alc 3.9%)", description: "ピーチの果実感たっぷりなのにすっきりとした甘さ" },
      { name: "甘口グリーンアップル (alc 3.9%)", description: "青リンゴの果実感たっぷり、甘さが特徴。" },
      { name: "甘口ライチ (alc 3.9%)", description: "ライチの果実感たっぷり、甘さが特徴。" },
    ],
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 2300 },
      { minQuantity: 24, maxQuantity: 47, price: 2250 },
      { minQuantity: 48, maxQuantity: 71, price: 2200 },
      { minQuantity: 72, maxQuantity: 95, price: 2150 },
      { minQuantity: 96, maxQuantity: 119, price: 2100 },
      { minQuantity: 120, maxQuantity: null, price: 2100 },
    ],
  },
  {
    name: "リステル",
    image:
      "/bottles/Listel.png?height=300&width=200",
    led: "LED対応",
    alcohol: "度数：2.5~3.5%",
    volume: "内容量：750ml",
    origin: "原産国：フランス",
    varieties: [
      { name: "ピーチ (alc 3.5%)", description: "ピーチのフルーティーで甘みのある飲みやすさ。" },
      { name: "青リンゴ (alc 3.5%)", description: "青リンゴの甘みとフレッシュな味わい。" },
      { name: "ライチ (alc 3.5%)", description: "ライチのアロマフレッシュな味わい。" },
      { name: "パイン (alc 3.5%)", description: "パイナップルのアロマフレッシュな味わい。" },
      { name: "ラズベリー (alc 3.5%)", description: "甘酸っぱくフレッシュ、微炭酸で飲みやすい。" },
      { name: "マスカット (alc 2.5%)", description: "フルーティーでフレッシュ、微炭酸で飲みやすい。" },
    ],
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 2500 },
      { minQuantity: 24, maxQuantity: 47, price: 2450 },
      { minQuantity: 48, maxQuantity: 71, price: 2400 },
      { minQuantity: 72, maxQuantity: 95, price: 2350 },
      { minQuantity: 96, maxQuantity: null, price: 2300 },
    ],
  },
  {
    name: "金箔マンズゴールド",
    image: "/bottles/GoldLeaf.png?height=300&width=200",
    led: "LED対応",
    alcohol: "度数：8.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      { name: "やや甘口マスカット (alc 8.5%)", description: "アルコール度数を感じさせないフルーティーな味。" },
    ],
    description:
      "キラキラ金箔入りのスパークリングワイン！マスカットのフルーティーな味わい。\r\nやや甘口のゴールド・スパークリングワインはフルーツのようなすっきりとした甘さで、香りも味もチャーミングです。",
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 2500 },
      { minQuantity: 24, maxQuantity: 47, price: 2450 },
      { minQuantity: 48, maxQuantity: 71, price: 2400 },
      { minQuantity: 72, maxQuantity: 95, price: 2350 },
      { minQuantity: 96, maxQuantity: null, price: 2300 },
    ],
  },
  {
    name: "プロヴェット",
    image: "/bottles/Momandor.png?height=300&width=200",
    led: "ブリュット：LED非対応、ロゼ：LED対応",
    alcohol: "度数：11.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      { name: "辛口ブリュット (alc 11.5%)", description: "コスパ抜群。フレッシュな辛口スパークリング。" },
      { name: "辛口ロゼ (alc 11.5%)", description: "コスパ抜群。フレッシュな辛口ロゼスパークリング。" },
    ],
    description:
      "左からブリュット、ロゼ。すっきりとした辛口の味わい。※こちらのお酒は大変格安で味の感想に対して個人差があります。\r\n辛口で無難なお酒を選びたい場合はアンジュエール、もまんドールをお選びください。",
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 1800 },
      { minQuantity: 24, maxQuantity: 47, price: 1750 },
      { minQuantity: 48, maxQuantity: 71, price: 1700 },
      { minQuantity: 72, maxQuantity: 95, price: 1650 },
      { minQuantity: 96, maxQuantity: null, price: 1600 },
    ],
  },
  {
    name: "モマンドール",
    image: "/bottles/Momandor.png?height=300&width=200",
    led: "ドライ：LED非対応、ロゼ・アイス：LED対応",
    alcohol: "度数：8.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      { name: "辛口ドライ (alc 8.5%)", description: "ヴーヴイエローとモエ白を足して2で割ったような味。" },
      { name: "甘口ロゼ (alc 8.5%)", description: "ヴーヴイエローとモエ白を足して2で割ったような味。" },
      { name: "中辛口アイス (alc 8.5%)", description: "ヴーヴホワイトをフレッシュにしたような味。" },
    ],
    description:
      "ドライ、ロゼ、アイスの３種類をご用意。ドライ、ロゼは高級感のあるテイスト。\r\nアイスはアルコール度数を感じさせないような爽やかさで飲みやすいオススメボトルとなります。",
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 2300 },
      { minQuantity: 24, maxQuantity: 47, price: 2250 },
      { minQuantity: 48, maxQuantity: 71, price: 2200 },
      { minQuantity: 72, maxQuantity: 95, price: 2150 },
      { minQuantity: 96, maxQuantity: null, price: 2100 },
    ],
  },
  {
    name: "モーヴ",
    image: "/bottles/NonAl.png?height=300&width=200",
    led: "LED非対応",
    alcohol: "度数：ノンアルコール",
    volume: "内容量：750ml",
    origin: "原産国：フランス",
    varieties: [
      { name: "甘口レッド (alc 0%)", description: "ブドウの甘み、渋み、果実感のある飲みやすい味。" },
      { name: "甘口ホワイト (alc 0%)", description: "りんごの甘み、渋み、甘さのある飲みやすい味。" },
      { name: "甘口アップル (alc 0%)", description: "ブドウの甘み、渋み、甘さのある飲みやすい味。" },
    ],
    description:
      "フランスのシードルメーカーが造るストレート果実100%のスパークリングジュース。着色料や甘味料は一切不使用。",
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 1800 },
      { minQuantity: 24, maxQuantity: 47, price: 1750 },
      { minQuantity: 48, maxQuantity: 71, price: 1700 },
      { minQuantity: 72, maxQuantity: 95, price: 1650 },
      { minQuantity: 96, maxQuantity: null, price: 1600 },
    ],
  },
]
