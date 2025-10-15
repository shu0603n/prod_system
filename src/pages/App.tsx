import { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
  SnackbarContent,
  Button,
  Stack,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";

import ProductSelection from "../components/ProductSelection";
import QuantityInput from "../components/QuantityInput";
import OptionsSelection from "../components/OptionsSelection";
import TotalCalculation from "../components/TotalCalculation";
import StepOverlay from "../components/StepOverlay";

import { options, Order, Product, Option, products } from "../data/data";
import { ShareIcon } from "lucide-react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e91e63", // ピンク系
      light: "#f48fb1",
      dark: "#c2185b",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff9800", // オレンジ系
    },
  },
});

// ============================
// ✅ メインコンポーネント
// ============================
export default function App() {
  const [orders, setOrders] = useState<Order[]>([
    {
      product: null,
      quantity: null,
      options: [],
    },
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [copied, setCopied] = useState(false); // ✅ コピー完了通知

  // ──────────────
  // データ取得
  // ──────────────

  // ──────────────
  // 各ステップ操作
  // ──────────────
  const handleProductSelect = (index: number, product: Product) => {
    const newOrders = [...orders];
    newOrders[index].product = product;
    setOrders(newOrders);
    if (currentStep === 1) setCurrentStep(2);
  };

  const handleQuantityChange = (index: number, quantity: number | null) => {
    const newOrders = [...orders];
    newOrders[index].quantity = quantity ? Number(quantity) : null;
    setOrders(newOrders);
    if (currentStep === 2) setCurrentStep(3);
  };

  const handleOptionSelect = (index: number, selectedOptions: Option[]) => {
    const newOrders = [...orders];
    newOrders[index].options = selectedOptions;
    setOrders(newOrders);
    if (currentStep === 3) setCurrentStep(4);
  };

  // ============================
  // ✅ 見積内容をコピーする処理
  // ============================
  const handleCopyEstimate = async () => {
    try {
      const estimateText = orders
        .map((order, i) => {
          const product = order.product ? order.product.name : "未選択";
          const qty = order.quantity ? `${order.quantity}本` : "未入力";
          const opts =
            order.options.length > 0
              ? order.options.map((o) => o.name).join(" / ")
              : "オプションなし";
          return `【注文${
            i + 1
          }】\nボトル：${product}\n数量：${qty}\nオプション：${opts}`;
        })
        .join("\n\n");

      await navigator.clipboard.writeText(estimateText);
      setCopied(true);
    } catch (error) {
      console.error("コピー失敗:", error);
    }
  };
  const stepTexts = [
    "ボトルを選択してください",
    "本数を入力してください",
    "オプションを選択してください",
    "合計金額が表示されます。追加の注文がある場合は追加ボタンを押してください。",
  ];

  // ============================
  // ✅ JSXレンダリング
  // ============================
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container maxWidth="md">
        {products.length && options.length ? (
          <Box sx={{ my: 4 }}>
            {/* ステップ表示 */}
            <StepOverlay step={currentStep} text={stepTexts[currentStep - 1]} />

            {/* 注文フォーム */}
            {orders.map((order, index) => (
              <Box key={index}>
                <ProductSelection
                  products={products}
                  selectedProduct={order.product}
                  onSelect={(product) => handleProductSelect(index, product)}
                />

                <QuantityInput
                  quantity={order.quantity}
                  onChange={(quantity) => handleQuantityChange(index, quantity)}
                />

                <OptionsSelection
                  options={options}
                  selectedOptions={order.options}
                  onSelect={(selectedOptions) =>
                    handleOptionSelect(index, selectedOptions)
                  }
                />
              </Box>
            ))}

            {/* 合計表示 */}
            <Box sx={{ mt: 4 }}>
              <TotalCalculation orders={orders} />

              {/* ✅ 2つのボタンを横並びで50%ずつ */}
              <Stack
                direction={{ xs: "column", sm: "row" }} // スマホでは縦並び、PCでは横並び
                spacing={2}
                sx={{ mt: 2 }}
              >
                {/* LINE相談ボタン */}
                <Button
                  variant="contained"
                  color="success"
                  href="https://line.me/R/ti/p/@367ihugx?from=page&accountId=367ihugx"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    flex: 1,
                    py: 1.5,
                    fontWeight: "bold",
                    fontSize: "1rem",
                    borderRadius: 3,
                    textTransform: "none",
                    backgroundColor: "#06C755", // LINEグリーン
                    "&:hover": {
                      backgroundColor: "#05b24a",
                    },
                  }}
                  startIcon={<ShareIcon fontSize="small" />}
                >
                  LINEで相談する
                </Button>

                {/* 見積コピー */}
                <Tooltip title="見積内容をコピー" arrow sx={{ flex: 1 }}>
                  <Button
                    onClick={handleCopyEstimate}
                    variant="contained"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      borderRadius: 3,
                      textTransform: "none",
                      backgroundColor: "#1e1e1e",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                    startIcon={<ContentCopy fontSize="small" />}
                  >
                    見積をコピーする
                  </Button>
                </Tooltip>
                <Snackbar
                  open={copied}
                  autoHideDuration={2500}
                  onClose={() => setCopied(false)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                  <SnackbarContent
                    sx={{
                      backgroundColor: "primary.light",
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                    message="見積内容をコピーしました！"
                  />
                </Snackbar>
              </Stack>
            </Box>
          </Box>
        ) : (
          // ✅ ローディング画面
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            gap={2}
          >
            <CircularProgress color="primary" size={60} thickness={5} />
            <Typography variant="h6" color="text.secondary">
              データを読み込み中です...
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
