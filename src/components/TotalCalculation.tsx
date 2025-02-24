import { Box, Typography, Divider, Paper, Chip, Stack } from '@mui/material';
import { Order, PriceRange } from "../data/data"

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
    const productPrice = getPrice(order.product.priceRanges, order.quantity ?? 0)
    const productTotal = productPrice * (order.quantity ?? 0)
    const optionsTotal = order.options.reduce((sum: any, option: any) => sum + option.price, 0)
    return productTotal + optionsTotal
  }

  const total = orders.reduce((sum, order) => sum + calculateTotal(order), 0)
  const tax = Math.floor(total * 0.1)
  const totalWithTax = total + tax

  return (
    

    <Box sx={{ my: 2, p: 2 }}>
      {orders.map((order, index) => (
        <Paper key={index} sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            🛍️ 注文 {index + 1}
          </Typography>
    
          {/* ボトル種類 */}
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ■ ボトル種類
          </Typography>
    
          {order.product ? (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {order.product.name}
              </Typography>
              {order.quantity ?? 0 > 0 ? (
                <>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    数量: {order.quantity} 本 ・ 合計: ¥
                    {(getPrice(order.product.priceRanges, order.quantity ?? 0) * (order.quantity ?? 0)).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    (単価: ¥{getPrice(order.product.priceRanges, order.quantity ?? 0).toLocaleString()})
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" sx={{ ml: 2, color: 'error.main' }}>
                  本数が選択されていません
                </Typography>
              )}
              
            </Box>
          ) : (
            <Typography variant="body1" sx={{ ml: 2, color: 'error.main' }}>
              選択されていません
            </Typography>
          )}
    
          {/* オプション */}
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            ■ オプション
          </Typography>
    
          {order.options.length > 0 ? (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', ml: 2 }}>
              {order.options.map((option: any, optionIndex: number) => (
                <Chip key={optionIndex} label={option.name} variant="outlined" />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
              オプションなし
            </Typography>
          )}
    
          <Box sx={{ mt: 2, ml: 2 }}>
            <Typography variant="body2">
              オプション合計: ¥{order.options.reduce((sum: any, option: any) => sum + option.price, 0).toLocaleString()}
            </Typography>
          </Box>
    
          {/* 小計・消費税 */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              小計: ¥{calculateTotal(order).toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              消費税(10%): ¥{Math.floor(calculateTotal(order) * 0.1).toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      ))}

        {/* <Paper sx={{ mb: 3, p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            🛍️ 手数料
          </Typography>

          <Box sx={{ mt: 2, ml: 2 }}>
            <Typography variant="body2">
              配送料: ¥1,000
            </Typography>
          </Box>
    
          <Divider sx={{ my: 2 }} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              小計: ¥1,000
            </Typography>
          </Box>
        </Paper> */}
  
      {/* 合計金額 */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, backgroundColor: 'primary.light' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', color: 'primary.contrastText' }}>
          💰 合計 : ¥{`${totalWithTax.toLocaleString() } (税込)`}
        </Typography>
      </Paper>
    </Box>
    
  )
}

