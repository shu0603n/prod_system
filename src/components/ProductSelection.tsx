"use client"

import { useState } from "react"
import { Box, Button, Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material"
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
      {/* <Button onClick={handlePrev} sx={{ position: "absolute", left: 0, top: "50%", zIndex: 1 }}>
        <ArrowBackIcon />
      </Button> */}
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
          <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {currentProduct.name}
          </Typography>
          <Typography variant="body2">{currentProduct.led}</Typography>
          <Typography variant="body2">{currentProduct.alcohol}</Typography>
          <Typography variant="body2">{currentProduct.volume}</Typography>
          <Typography variant="body2">{currentProduct.origin}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            価格表
          </Typography>
          <List>
            {currentProduct.priceRanges.map((range, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${range.minQuantity}${range.maxQuantity ? ` 〜 ${range.maxQuantity}` : " 〜"}本`}
                  secondary={`¥${range.price.toLocaleString()} (税込 ¥${(range.price * 1.1).toLocaleString()})`}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            種類
          </Typography>
          <List>
            {currentProduct.varieties.map((variety, index) => (
              <ListItem key={index}>
                <ListItemText primary={variety.name} secondary={variety.description} />
              </ListItem>
            ))}
          </List>
          {currentProduct.description && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {currentProduct.description}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={() => onSelect(currentProduct)}
            disabled={selectedProduct?.name === currentProduct.name}
            sx={{ mt: 2 }}
          >
            選択
          </Button>
        </CardContent>
      </Card>
      {/* <Button onClick={handleNext} sx={{ position: "absolute", right: 0, top: "50%", zIndex: 1 }}>
        <ArrowForwardIcon />
      </Button> */}
    </Box>
  )
}

