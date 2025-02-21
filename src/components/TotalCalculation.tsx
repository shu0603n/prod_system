import { Box, Typography } from "@mui/material"
import type { Order, PriceRange } from "../App"

interface TotalCalculationProps {
  orders: Order[]
}

function getPrice(priceRanges: PriceRange[], quantity: number): number {
  for (const range of priceRanges) {
    if (quantity >= range.minQuantity && (range.maxQuantity === null || quantity <= range.maxQuantity)) {
      return range.price
    }
  }
  return priceRanges[priceRanges.length - 1].price
}

export default function TotalCalculation({ orders }: TotalCalculationProps) {
  const calculateTotal = (order: Order) => {
    if (!order.product) return 0
    const productPrice = getPrice(order.product.priceRanges, order.quantity)
    const productTotal = productPrice * order.quantity
    const optionsTotal = order.options.reduce((sum, option) => sum + option.price, 0)
    return productTotal + optionsTotal
  }

  const total = orders.reduce((sum, order) => sum + calculateTotal(order), 0)
  const tax = Math.floor(total * 0.1)
  const totalWithTax = total + tax

  return (
    <Box sx={{ my: 2, border: 1, borderColor: "grey.300", p: 2 }}>
      {orders.map((order, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Typography variant="h6">■ボトル種類</Typography>
          {order.product ? (
            <>
              <Typography variant="body1">{order.product.name}</Typography>
              <Typography>
                {order.quantity} 本 ¥
                {(getPrice(order.product.priceRanges, order.quantity) * order.quantity).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                (単価: ¥{getPrice(order.product.priceRanges, order.quantity).toLocaleString()})
              </Typography>
            </>
          ) : (
            <Typography variant="body1">選択されていません</Typography>
          )}
          <Typography variant="h6">■オプション</Typography>
          {order.options.map((option, optionIndex) => (
            <Typography key={optionIndex}>{option.name}</Typography>
          ))}
          <Typography>¥{order.options.reduce((sum, option) => sum + option.price, 0).toLocaleString()}</Typography>
          <Typography>---------------</Typography>
          <Typography>小計 ¥{calculateTotal(order).toLocaleString()}</Typography>
          <Typography>消費税(10%) ¥{Math.floor(calculateTotal(order) * 0.1).toLocaleString()}</Typography>
          <Typography>---------------</Typography>
        </Box>
      ))}
      <Typography variant="h6">合計(税込) ¥{totalWithTax.toLocaleString()}</Typography>
    </Box>
  )
}

