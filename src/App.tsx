"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import DeleteIcon from "@mui/icons-material/Delete"
import ProductSelection from "./components/ProductSelection"
import QuantityInput from "./components/QuantityInput"
import OptionsSelection from "./components/OptionsSelection"
import TotalCalculation from "./components/TotalCalculation"
import AddOrderButton from "./components/AddOrderButton"
import StepOverlay from "./components/StepOverlay"

const theme = createTheme()

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

const products: Product[] = [
  {
    name: "バーロワイヤル",
    image:
      "https://storage.googleapis.com/studio-design-asset-files/projects/wQOVJ9RNOD/s-2400x1800_v-frms_webp_7d13dbbd-9731-4de0-8399-49ef672c0a15_middle.webp",
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
      "https://storage.googleapis.com/studio-design-asset-files/projects/wQOVJ9RNOD/s-2400x1697_v-frms_webp_e6854bf5-5f42-4af4-8965-900947456123_middle.webp",
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
    image: "/placeholder.svg?height=300&width=200",
    led: "LED対応",
    alcohol: "度数：8.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      { name: "やや甘口マスカット (alc 8.5%)", description: "アルコール度数を感じさせないフルーティーな味。" },
    ],
    description:
      "キラキラ金箔入りのスパークリングワイン！マスカットのフルーティーな味わい。やや甘口のゴールド・スパークリングワインはフルーツのようなすっきりとした甘さで、香りも味もチャーミングです。",
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
    image: "/placeholder.svg?height=300&width=200",
    led: "ブリュット：LED非対応、ロゼ：LED対応",
    alcohol: "度数：11.5%",
    volume: "内容量：750ml",
    origin: "原産国：スペイン",
    varieties: [
      { name: "辛口ブリュット (alc 11.5%)", description: "コスパ抜群。フレッシュな辛口スパークリング。" },
      { name: "辛口ロゼ (alc 11.5%)", description: "コスパ抜群。フレッシュな辛口ロゼスパークリング。" },
    ],
    description:
      "左からブリュット、ロゼ。すっきりとした辛口の味わい。※こちらのお酒は大変格安で味の感想に対して個人差があります。辛口で無難なお酒を選びたい場合はアンジュエール、もまんドールをお選びください。",
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
    image: "/placeholder.svg?height=300&width=200",
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
      "ドライ、ロゼ、アイスの３種類をご用意。ドライ、ロゼは高級感のあるテイスト。アイスはアルコール度数を感じさせないような爽やかさで飲みやすいオススメボトルとなります。",
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
    image: "/placeholder.svg?height=300&width=200",
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

const options: Option[] = [
  { name: "なし", price: 0 },
  { name: "LEDライト", price: 300 },
  { name: "キャップシール変更", price: 300 },
  { name: "アクリルキーホルダー", price: 300 },
]

const stepTexts = [
  "商品を選択してください",
  "本数を入力してください",
  "オプションを選択してください",
  "合計金額を確認してください",
  "注文を追加しますか？",
]

export default function App() {
  const [orders, setOrders] = useState<Order[]>([{ product: null, quantity: 1, options: [options[0]] }])
  const [currentStep, setCurrentStep] = useState(1)
  const [overlayKey, setOverlayKey] = useState(0)

  const refs = {
    step1: useRef<HTMLDivElement>(null),
    step2: useRef<HTMLDivElement>(null),
    step3: useRef<HTMLDivElement>(null),
    step4: useRef<HTMLDivElement>(null),
    step5: useRef<HTMLDivElement>(null),
  }

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    setOverlayKey((prevKey) => prevKey + 1)
  }, [])

  const handleProductSelect = (index: number, product: Product) => {
    const newOrders = [...orders]
    newOrders[index].product = product
    setOrders(newOrders)
    if (currentStep === 1) {
      setCurrentStep(2)
      scrollToRef(refs.step2)
    }
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const newOrders = [...orders]
    newOrders[index].quantity = quantity
    setOrders(newOrders)
    if (currentStep === 2) {
      setCurrentStep(3)
      scrollToRef(refs.step3)
    }
  }

  const handleOptionSelect = (index: number, selectedOptions: Option[]) => {
    const newOrders = [...orders]
    newOrders[index].options = selectedOptions
    setOrders(newOrders)
    if (currentStep === 3) {
      setCurrentStep(4)
      scrollToRef(refs.step4)
    }
  }

  const handleAddOrder = () => {
    setOrders([...orders, { product: null, quantity: 1, options: [options[0]] }])
    setCurrentStep(1)
    scrollToRef(refs.step1)
  }

  const handleDeleteOrder = (index: number) => {
    const newOrders = orders.filter((_, i) => i !== index)
    setOrders(newOrders)
    if (newOrders.length === 0) {
      handleAddOrder()
    }
  }

  const isStep1Completed = orders.every((order) => order.product !== null)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            見積もりシステム
          </Typography>

          {!isStep1Completed && <StepOverlay step={1} text={stepTexts[0]} />}

          {orders.map((order, index) => (
            <Box key={index} sx={{ mb: 4, position: "relative" }}>
              <Typography variant="h5" component="h2" gutterBottom>
                注文 {index + 1}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteOrder(index)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                削除
              </Button>

              <Box ref={index === 0 ? refs.step1 : undefined}>
                <ProductSelection
                  products={products}
                  selectedProduct={order.product}
                  onSelect={(product) => handleProductSelect(index, product)}
                />
              </Box>

              {order.product && (
                <>
                  <Box ref={index === 0 ? refs.step2 : undefined}>
                    <QuantityInput
                      quantity={order.quantity}
                      onChange={(quantity) => handleQuantityChange(index, quantity)}
                    />
                  </Box>

                  <Box ref={index === 0 ? refs.step3 : undefined}>
                    <OptionsSelection
                      options={options}
                      selectedOptions={order.options}
                      onSelect={(selectedOptions) => handleOptionSelect(index, selectedOptions)}
                    />
                  </Box>
                </>
              )}
            </Box>
          ))}

          <Box ref={refs.step4}>
            <TotalCalculation orders={orders} />
          </Box>

          <Box ref={refs.step5}>
            <AddOrderButton onClick={handleAddOrder} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

