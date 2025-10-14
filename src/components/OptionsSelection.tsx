import { Box, Typography, Card } from "@mui/material";
import Image from "next/image";
import type { Option } from "../data/data";

interface OptionsSelectionProps {
  options: Option[];
  selectedOptions: Option[];
  onSelect: (selectedOptions: Option[]) => void;
}

export default function OptionsSelection({
  options,
  selectedOptions,
  onSelect,
}: OptionsSelectionProps) {
  const handleOptionChange = (option: Option) => {
    let newSelectedOptions: Option[];
    if (option.name === "なし") {
      newSelectedOptions = [option];
    } else {
      newSelectedOptions = selectedOptions.filter((o) => o.name !== "なし");
      const index = newSelectedOptions.findIndex((o) => o.name === option.name);
      if (index === -1) newSelectedOptions.push(option);
      else newSelectedOptions.splice(index, 1);
      if (newSelectedOptions.length === 0) newSelectedOptions = [options[0]];
    }
    onSelect(newSelectedOptions);
  };

  return (
    <>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
      >
        STEP3 オプションを選択
      </Typography>

      {/* ✅ 横スクロール対応コンテナ */}
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
        {options
          .sort((a, b) => a.sortId - b.sortId)
          .map((option, index) => {
            const isSelected = selectedOptions.some(
              (o) => o.name === option.name
            );

            return (
              <Card
                key={option.name}
                onClick={() => handleOptionChange(option)}
                sx={(theme) => ({
                  flex: "0 0 auto",
                  width: "150px",
                  cursor: "pointer",
                  scrollSnapAlign: "start",
                  border: isSelected
                    ? `3px solid ${theme.palette.primary.main}`
                    : `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  boxShadow: isSelected
                    ? "0 4px 12px rgba(25, 118, 210, 0.3)"
                    : "0 2px 6px rgba(0, 0, 0, 0.1)",
                  transform: isSelected ? "scale(1.05)" : "scale(1)",
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
                  {option.image ? (
                    <>
                      {/* ✅ next/image で最適化 */}
                      <Image
                        src={option.image}
                        alt={option.name}
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="150px"
                        priority={index < 4}
                        loading={index >= 4 ? "lazy" : "eager"}
                        placeholder="blur"
                        blurDataURL="/placeholder.png" // 小さな透過PNGを置くと◎
                      />

                      {/* 上部のラベル */}
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
                        {option.name}
                      </Typography>

                      {/* 下部の価格 */}
                      <Typography
                        variant="subtitle2"
                        sx={{
                          position: "absolute",
                          bottom: 10,
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
                        ¥{option.price.toLocaleString()}
                      </Typography>
                    </>
                  ) : (
                    // ✅ 軽量な「なし」表示
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "primary.light",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          color: "primary.contrastText",
                        }}
                      >
                        なし
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>
            );
          })}
      </Box>
    </>
  );
}
