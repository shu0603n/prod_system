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
  Alert,
  SnackbarContent,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import ProductSelection from "../components/ProductSelection";
import QuantityInput from "../components/QuantityInput";
import OptionsSelection from "../components/OptionsSelection";
import TotalCalculation from "../components/TotalCalculation";
import StepOverlay from "../components/StepOverlay";

import { Order, Product, Option } from "../data/data";

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
// ✅ API経由でDBのデータを取得
// ============================
async function getProducts(): Promise<{
  products: Product[];
  options: Option[];
}> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  try {
    const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products and options");
    return await res.json();
  } catch (error) {
    console.error("❌ 商品データ取得エラー:", error);
    return { products: [], options: [] };
  }
}

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
  const [products, setProducts] = useState<Product[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [copied, setCopied] = useState(false); // ✅ コピー完了通知

  // ──────────────
  // データ取得
  // ──────────────
  useEffect(() => {
    (async () => {
      const { products, options } = await getProducts();
      setProducts(products);
      setOptions(options);
    })();
  }, []);

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
              {/* ✅ コピーアイコン付きボタン */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Tooltip title="見積内容をコピー" arrow>
                  <IconButton
                    onClick={handleCopyEstimate}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      backgroundColor: "#1e1e1e",
                      color: "#fff",
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    <ContentCopyIcon fontSize="small" />
                    <Typography variant="body2">見積をコピーする</Typography>
                  </IconButton>
                </Tooltip>
              </Box>
              {/* ✅ コピー完了スナックバー */}
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
