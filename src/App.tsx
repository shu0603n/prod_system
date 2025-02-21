"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import DeleteIcon from "@mui/icons-material/Delete"
import ProductSelection from "./components/ProductSelection"
import QuantityInput from "./components/QuantityInput"
import OptionsSelection from "./components/OptionsSelection"
import TotalCalculation from "./components/TotalCalculation"
import AddOrderButton from "./components/AddOrderButton"
import StepOverlay from "./components/StepOverlay"
import { options, Order, Product, Option, products, stepTexts } from "./data/data"
import { Chip, Accordion, AccordionSummary, AccordionDetails, IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const theme = createTheme()

export default function App() {
  const [orders, setOrders] = useState<Order[]>([{ product: null, quantity: 1, options: [options[0]] }])
  const [currentStep, setCurrentStep] = useState(1)
  const [expandedIndex, setExpandedIndex] = useState<number | false>(0)

  const handleAccordionChange = (index: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedIndex(isExpanded ? index : false)
  }

  const handleProductSelect = (index: number, product: Product) => {
    const newOrders = [...orders]
    newOrders[index].product = product
    setOrders(newOrders)
    if (currentStep === 1) {
      setCurrentStep(2)
    }
  }

  const handleQuantityChange = (index: number, quantity: number) => {
    const newOrders = [...orders]
    newOrders[index].quantity = quantity
    setOrders(newOrders)
    if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleOptionSelect = (index: number, selectedOptions: Option[]) => {
    const newOrders = [...orders]
    newOrders[index].options = selectedOptions
    setOrders(newOrders)
    if (currentStep === 3) {
      setCurrentStep(4)
    }
  }

  const handleAddOrder = () => {
    const newOrders = [...orders, { product: null, quantity: 1, options: [options[0]] }]
    setOrders(newOrders)
    setExpandedIndex(newOrders.length - 1)
    setCurrentStep(1)
  }

  const handleDeleteOrder = (index: number) => {
    const newOrders = orders.filter((_, i) => i !== index)
    setOrders(newOrders)
    if (newOrders.length === 0) {
      handleAddOrder()
    } else {
      setExpandedIndex(0)
    }
  }

  const isStep1Completed = orders.every((order) => order.product !== null)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            料金シミュレーション
          </Typography>

          {!isStep1Completed && <StepOverlay step={1} text={stepTexts[0]} />}

          {orders.map((order, index) => (
            <Accordion key={index} expanded={expandedIndex === index} onChange={handleAccordionChange(index)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Chip
                  icon={<ShoppingCartIcon />}
                  label={`注文 ${index + 1}`}
                  color="primary"
                  sx={{ fontSize: '1rem', fontWeight: 'bold', px: 2, py: 2, borderRadius: 2, boxShadow: 2 }}
                />
                <IconButton
                  component="span"
                  color="error"
                  onClick={() => handleDeleteOrder(index)}
                  sx={{ ml: 2 }}
                >
                  <CloseIcon />
                </IconButton>

              </AccordionSummary>
              <AccordionDetails>
                <ProductSelection
                  products={products}
                  selectedProduct={order.product}
                  onSelect={(product) => handleProductSelect(index, product)}
                />
                {order.product && (
                  <>
                    <QuantityInput
                      quantity={order.quantity}
                      onChange={(quantity) => handleQuantityChange(index, quantity)}
                    />
                    <OptionsSelection
                      options={options}
                      selectedOptions={order.options}
                      onSelect={(selectedOptions) => handleOptionSelect(index, selectedOptions)}
                    />
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          <Box sx={{ mt: 4 }}>
            <AddOrderButton onClick={handleAddOrder} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <TotalCalculation orders={orders} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
