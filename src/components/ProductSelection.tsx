"use client"

import { useState } from "react"
import { Box, Card, CardContent, CardMedia, IconButton } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import type { Product } from "../App"

interface ProductSelectionProps {
  products: Product[]
  selectedProduct: Product | null
  onSelect: (product: Product) => void
}

export default function ProductSelection({ products, selectedProduct, onSelect }: ProductSelectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : products.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < products.length - 1 ? prevIndex + 1 : 0))
  }

  const currentProduct = products[currentIndex]

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card sx={{ maxWidth: 600, width: "100%" }}>
        <Box sx={{ position: "relative" }}>
          <CardMedia component="img" height="400" image={currentProduct.image} alt={currentProduct.name} />
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <CardContent>{/* 残りのコンテンツは変更なし */}</CardContent>
      </Card>
    </Box>
  )
}

