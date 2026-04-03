import { Box, Typography, Divider, Paper, Stack } from "@mui/material";
import { Order, PriceRange } from "../data/data";

interface TotalCalculationProps {
  orders: Order[];
}

// 本数に応じて価格帯から単価を取得
function getPrice(priceRanges: PriceRange[], quantity: number): number {
  if (!priceRanges || priceRanges.length === 0) return 0;

  for (const range of priceRanges) {
    if (
      quantity >= range.minQuantity &&
      (range.maxQuantity === null || quantity <= range.maxQuantity)
    ) {
      return range.price;
    }
  }

  // 該当しない場合は末尾の価格を返す
  return priceRanges[priceRanges.length - 1].price;
}

export default function TotalCalculation({ orders }: TotalCalculationProps) {
  const calculateTotal = (order: Order) => {
    if (!order.product) return 0;

    const qty = order.quantity ?? 0;
    const productPrice = getPrice(order.product.priceRanges, qty);
    const productTotal = productPrice * qty;

    const optionsTotal = order.options.reduce((sum, o) => {
      // id が 5 のオプションは数量を掛けない
      if (o.id === 5) {
        return sum + o.price;
      }
      return sum + o.price * qty;
    }, 0);

    return productTotal + optionsTotal;
  };

  const subtotal = orders.reduce(
    (sum, order) => sum + calculateTotal(order),
    0,
  );
  const tax = Math.floor(subtotal * 0.1);
  const totalWithTax = subtotal + tax;

  return (
    <>
      {orders.map((order, index) => {
        const qty = order.quantity ?? 0;
        const hasProduct = !!order.product;

        const selectedVariety = order?.product?.varieties.find(
          (v) => v.selected,
        );

        const optionsTotal = order.options.reduce((sum, o) => {
          // id が 5 のオプションは数量を掛けない
          if (o.id === 5) {
            return sum + o.price;
          }
          return sum + o.price * qty;
        }, 0);

        const unitPrice = hasProduct
          ? getPrice(order.product!.priceRanges, qty)
          : 0;

        return (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              ■ ボトル種類
            </Typography>

            {hasProduct ? (
              <Box sx={{ ml: 2, mt: 1 }}>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  useFlexGap
                  alignItems="flex-start"
                  spacing={1}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {order.product!.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    (単価: ¥{unitPrice.toLocaleString()})
                  </Typography>
                </Stack>

                {selectedVariety ? (
                  <Typography variant="body2" color="text.secondary">
                    味: {selectedVariety.name}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="error.main"
                    sx={{ mt: 0.5 }}
                  >
                    味が選択されていません
                  </Typography>
                )}

                {qty > 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    数量: {qty} 本 ・ 合計: ¥
                    {(unitPrice * qty).toLocaleString()}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    color="error.main"
                    sx={{ mt: 0.5 }}
                  >
                    本数が選択されていません
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="error.main"
                sx={{ ml: 2, mt: 1 }}
              >
                ボトルが選択されていません
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "text.secondary" }}
            >
              ■ オプション
            </Typography>

            {order.options.length > 0 &&
            order.options.some((option) => option.id !== 1) ? (
              <Box sx={{ ml: 2, mt: 1 }}>
                {order.options.map((option, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    flexWrap="wrap"
                    useFlexGap
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      {option.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      (単価: ¥{option.price.toLocaleString()})
                    </Typography>
                  </Stack>
                ))}
                <Typography variant="body2" color="text.secondary">
                  合計: ¥{optionsTotal.toLocaleString()}
                </Typography>
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ ml: 2, mt: 0.5 }}
              >
                オプションなし
              </Typography>
            )}

            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ ml: 2 }}>
              <Typography variant="body1" fontWeight="bold">
                小計: ¥{calculateTotal(order).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                消費税(10%): ¥
                {Math.floor(calculateTotal(order) * 0.1).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        );
      })}

      <Paper
        sx={(theme) => ({
          mt: 3,
          p: 3,
          borderRadius: 3,
          boxShadow: 4,
          background: `${theme.palette.primary.dark}`,
          color: theme.palette.primary.contrastText,
        })}
      >
        <Typography
          variant="h6"
          align="center"
          fontWeight="bold"
          sx={{ letterSpacing: 1 }}
        >
          合計金額（税込）
        </Typography>
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mt: 1, color: "white" }}
        >
          ¥{totalWithTax.toLocaleString()}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 0.5, opacity: 0.8 }}
        >
          (内消費税 ¥{tax.toLocaleString()} / 小計 ¥{subtotal.toLocaleString()})
        </Typography>
      </Paper>
    </>
  );
}
