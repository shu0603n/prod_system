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
import { products } from "./data/data"

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
    step1: useRef<HTMLDivElement | null>(null),
    step2: useRef<HTMLDivElement | null>(null),
    step3: useRef<HTMLDivElement | null>(null),
    step4: useRef<HTMLDivElement | null>(null),
    step5: useRef<HTMLDivElement | null>(null),
  }

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
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
    // scrollToRef(refs.step1)
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
          <Box ref={refs.step5}>
            <AddOrderButton onClick={handleAddOrder} />
          </Box>

          <Box ref={refs.step4}>
            <TotalCalculation orders={orders} />
          </Box>


        </Box>
      </Container>
    </ThemeProvider>
  )
}

