export type PriceRange = {
  minQuantity: number;
  maxQuantity: number | null;
  price: number;
};

export type Product = {
  name: string;
  image: string;
  led: string;
  alcohol: string;
  volume: string;
  origin: string;
  varieties: Variety[];
  description?: string;
  priceRanges: PriceRange[];
  sortId: number;
  selectedVariety?: string;
};

export type Variety = {
  name: string;
  description?: string;
  selected: boolean;
};

export type Option = {
  id: number;
  image?: any;
  name: string;
  price: number;
  unit?: string;
  sortId: number;
};

export type Order = {
  product: Product | null;
  quantity: number | null;
  options: Option[];
};

export const options: Option[] = [
  { id: 1, name: "なし", price: 0, sortId: 0 },
  {
    id: 2,
    name: "LEDライト",
    price: 300,
    unit: "1個",
    image: "/bottles/LED発光ボトル.png",
    sortId: 4,
  },
  {
    id: 3,
    name: "キャップシール",
    price: 300,
    unit: "1個",
    image: "/bottles/キャップシール.png",
    sortId: 1,
  },
  {
    id: 4,
    name: "キーホルダー",
    price: 300,
    unit: "1個",
    image: "/bottles/アクリルキーホルダー.png",
    sortId: 3,
  },
  {
    id: 5,
    name: "卓上ポップ",
    price: 2800,
    unit: "４枚",
    image: "/bottles/卓上POPイメージ.png",
    sortId: 5,
  },
  {
    id: 6,
    name: "ネックシール",
    price: 300,
    unit: "1個",
    image: "/bottles/ネックシール.png",
    sortId: 2,
  },
];

export const products: Product[] = [
  {
    name: "バーロワイヤル",
    image: "/bottles/バーロワ(バーロワイヤル).png",
    led: "LED対応",
    alcohol: "度数：3.9%",
    volume: "内容量：750ml",
    origin: "原産国：ドイツ",
    varieties: [
      {
        name: "ｸﾞﾘｰﾝｱｯﾌﾟﾙ",
        description: "青リンゴの果実感たっぷり、甘さが特徴。",
        selected: false,
      },
      {
        name: "ライチ",
        description: "ライチの果実感たっぷり、甘さが特徴。",
        selected: false,
      },
      {
        name: "マンゴー",
        description: "マンゴーの繊細な果実感があり飲みやすい。",
        selected: false,
      },
      {
        name: "ｽﾄﾛﾍﾞﾘｰ",
        description: "イチゴの果実感と甘酸っぱさ。",
        selected: false,
      },
      {
        name: "レモン",
        description: "レモンの清涼感、爽やかさと果実感。",
        selected: false,
      },

      {
        name: "ピーチ",
        description: "ピーチの果実感たっぷりなのにすっきりとした甘さ",
        selected: false,
      },
    ],
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 2300 },
      { minQuantity: 24, maxQuantity: 47, price: 2250 },
      { minQuantity: 48, maxQuantity: 71, price: 2200 },
      { minQuantity: 72, maxQuantity: 95, price: 2150 },
      { minQuantity: 96, maxQuantity: 119, price: 2100 },
      { minQuantity: 120, maxQuantity: null, price: 2100 },
    ],
    sortId: 2,
  },
  {
    name: "リステル",
    image: "/bottles/リステル【パイン】.png",
    led: "LED対応",
    alcohol: "度数：2.5~3.5%",
    volume: "内容量：750ml",
    origin: "原産国：フランス",
    varieties: [
      {
        name: "マスカット",
        description: "フルーティーでフレッシュ、微炭酸で飲みやすい。",
        selected: false,
      },
      {
        name: "ライチ",
        description: "ライチのアロマフレッシュな味わい。",
        selected: false,
      },
      {
        name: "パイン",
        description: "パイナップルのアロマフレッシュな味わい。",
        selected: false,
      },
      {
        name: "ラズベリー",
        description: "甘酸っぱくフレッシュ、微炭酸で飲みやすい。",
        selected: false,
      },
      {
        name: "青リンゴ",
        description: "青リンゴの甘みとフレッシュな味わい。",
        selected: false,
      },
      {
        name: "ピーチ",
        description: "ピーチのフルーティーで甘みのある飲みやすさ。",
        selected: false,
      },
    ],
    priceRanges: [
      { minQuantity: 6, maxQuantity: 23, price: 2500 },
      { minQuantity: 24, maxQuantity: 47, price: 2450 },
      { minQuantity: 48, maxQuantity: 71, price: 2400 },
      { minQuantity: 72, maxQuantity: 95, price: 2350 },
      { minQuantity: 96, maxQuantity: null, price: 2300 },
    ],
    sortId: 3,
  },
  {
    name: "金箔ﾏﾝｽﾞｺﾞｰﾙﾄﾞ",
    image: "/bottles/金箔マンズゴールド.png",
    led: "LED対応",
    alcohol: "度数：11.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      {
        name: "やや甘口マスカット",
        description: "アルコール度数を感じさせないフルーティーな味。",
        selected: false,
      },
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
    sortId: 6,
  },
  {
    name: "プロヴェット",
    image: "/bottles/プロヴェット(ロゼ).png",
    led: "ロゼのみLED対応",
    alcohol: "度数：11.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      {
        name: "ブリュット",
        description: "コスパ抜群。フレッシュな辛口スパークリング。",
        selected: false,
      },
      {
        name: "ロゼ",
        description: "コスパ抜群。フレッシュな辛口ロゼスパークリング。",
        selected: false,
      },
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
    sortId: 1,
  },
  {
    name: "モマンドール",
    image: "/bottles/モマンドールアイス.png",
    led: "ロゼ・アイスのみLED対応",
    alcohol: "度数：8.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      {
        name: "アイス",
        description: "ヴーヴホワイトをフレッシュにしたような味。",
        selected: false,
      },
      {
        name: "ドライ",
        description: "ヴーヴイエローとモエ白を足して2で割ったような味。",
        selected: false,
      },
      {
        name: "ロゼ",
        description: "ヴーヴイエローとモエ白を足して2で割ったような味。",
        selected: false,
      },
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
    sortId: 4,
  },
  {
    name: "モーヴ",
    image: "/bottles/モーヴ(ホワイトグレープ).png",
    led: "LED非対応",
    alcohol: "度数：ノンアルコール",
    volume: "内容量：750ml",
    origin: "原産国：フランス",
    varieties: [
      {
        name: "アップル",
        description: "ブドウの甘み、渋み、甘さのある飲みやすい味。",
        selected: false,
      },

      {
        name: "ﾎﾜｲﾄｸﾞﾚｰﾌﾟ",
        description: "りんごの甘み、渋み、甘さのある飲みやすい味。",
        selected: false,
      },
      {
        name: "ﾚｯﾄﾞｸﾞﾚｰﾌﾟ",
        description: "ブドウの甘み、渋み、果実感のある飲みやすい味。",
        selected: false,
      },
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
    sortId: 5,
  },
];
