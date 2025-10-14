import { useEffect, useState } from "react";
import { Box, Card, CardMedia, Typography, Chip } from "@mui/material";
import { Product } from "../data/data";

interface ProductSelectionProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelect: (product: Product) => void;
}

export default function ProductSelection({
  products,
  selectedProduct,
  onSelect,
}: ProductSelectionProps) {
  useEffect(() => {
    products.forEach((p) => {
      const img = new Image();
      img.src = p.image;
    });
  }, [products]);

  // const [selectProduct, setSelectedProduct] = useState<Product>();

  const handleClick = (product: Product) => {
    onSelect(product);
    // setSelectedProduct(product);
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
      >
        STEP1 ボトルを選ぶ
      </Typography>

      {/* スクロールできるボトル一覧 */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          padding: 2,
          scrollSnapType: "x mandatory",
          pb: 2,
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#bbb",
            borderRadius: 4,
          },
        }}
      >
        {products.map((product, index) => (
          <Card
            key={index}
            onClick={() => handleClick(product)}
            sx={(theme) => ({
              flex: "0 0 auto",
              width: "25%",
              cursor: "pointer",
              scrollSnapAlign: "start",
              border:
                selectedProduct?.name === product.name
                  ? `3px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              boxShadow:
                selectedProduct?.name === product.name
                  ? "0 4px 12px rgba(25, 118, 210, 0.3)" // 選択時: 青っぽい影
                  : "0 2px 6px rgba(0, 0, 0, 0.1)",
              transform:
                selectedProduct?.name === product.name
                  ? "scale(1.05)"
                  : "scale(1)",
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                transform: "scale(1.05)",
                borderColor: theme.palette.primary.main,
              },
            })}
          >
            <Box
              sx={{
                position: "relative",
                display: "inline-block",
                width: "100%", // カード幅にフィット
                height: 150, // ← ここで高さを明示
                backgroundColor: "#fafafa",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // 枠内に収める
                }}
              />

              <Typography
                variant="subtitle2"
                sx={{
                  position: "absolute",
                  top: 6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.55)",
                  color: "#fff",
                  px: 1.5,
                  py: 0.3,
                  borderRadius: 1,
                  fontWeight: "bold",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                  maxWidth: "90%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.name}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
      {selectedProduct && (
        <Box sx={{ p: 2 }}>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="left"
            gap={1}
            sx={{ mb: 2 }}
          >
            <Chip label={selectedProduct.led} size="small" />
            <Chip label={selectedProduct.alcohol} size="small" />
            <Chip label={selectedProduct.volume} size="small" />
            <Chip label={selectedProduct.origin} size="small" />
          </Box>
        </Box>
      )}
    </>
  );
}
