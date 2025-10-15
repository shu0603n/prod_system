import { Box, Card, Typography, Chip } from "@mui/material";
import Image from "next/image";
import { Product, Variety } from "../data/data";

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
  const handleClick = (product: Product, variety?: Variety) => {
    // ✅ まず全ての selected を false に戻す
    product.varieties = product.varieties.map((v) => ({
      ...v,
      selected: false,
    }));
    // ✅ 該当する variety を探す
    if (variety) {
      const index = product.varieties.findIndex((v) => v.name === variety.name);

      if (index !== -1) {
        // ✅ 該当のものだけ true にする
        product.varieties[index] = {
          ...product.varieties[index],
          ...variety,
          selected: true,
        };
      }
    }

    // variety ? (newProduct.selectedVariety = variety.name) : [];
    onSelect(product);
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
      >
        STEP1-1 ボトルを選ぶ
      </Typography>
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
        {products
          .sort((a, b) => a.sortId - b.sortId)
          .map((product, index) => (
            <Card
              key={index}
              onClick={() => handleClick(product)}
              sx={(theme) => ({
                flex: "0 0 auto",
                width: "150px",
                cursor: "pointer",
                scrollSnapAlign: "start",
                border:
                  selectedProduct?.name === product.name
                    ? `3px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                boxShadow:
                  selectedProduct?.name === product.name
                    ? "0 4px 12px rgba(25, 118, 210, 0.3)"
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
                  width: "100%",
                  aspectRatio: "1 / 1",
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="150px"
                  priority={index < 4}
                  loading={index >= 4 ? "lazy" : "eager"}
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
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
        <>
          <Box sx={{ p: 2 }}>
            <Box display="flex" flexWrap="wrap" justifyContent="left" gap={1}>
              <Chip label={selectedProduct.led} size="small" />
              <Chip label={selectedProduct.alcohol} size="small" />
              {/* <Chip label={selectedProduct.volume} size="small" />
              <Chip label={selectedProduct.origin} size="small" /> */}
            </Box>
          </Box>

          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
          >
            STEP1-2 味を選ぶ
          </Typography>
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
            {selectedProduct.varieties.map((variety, index) => (
              <Card
                key={index}
                onClick={() => handleClick(selectedProduct, variety)}
                sx={(theme) => ({
                  flex: "0 0 auto",
                  width: "110px",
                  cursor: "pointer",
                  scrollSnapAlign: "start",
                  border: variety.selected
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  boxShadow: variety.selected
                    ? "0 4px 12px rgba(25, 118, 210, 0.3)"
                    : "0 2px 6px rgba(0, 0, 0, 0.1)",
                  transform: variety.selected ? "scale(1.05)" : "scale(1)",
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
                    width: "100%",
                    backgroundColor: "#fafafa",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "primary.main",
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
                    {variety.name}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </>
      )}
    </>
  );
}
