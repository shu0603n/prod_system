import {
  Box,
  Checkbox,
  Typography,
  Card,
  CardMedia,
  Paper,
} from "@mui/material";
import type { Option } from "../data/data";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

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
      if (index === -1) {
        newSelectedOptions.push(option);
      } else {
        newSelectedOptions.splice(index, 1);
      }
      if (newSelectedOptions.length === 0) {
        newSelectedOptions = [options[0]]; // 'なし' オプション
      }
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
        {options.map((option) => {
          const isSelected = selectedOptions.some(
            (o) => o.name === option.name
          );

          return (
            <Card
              key={option.name}
              onClick={() => handleOptionChange(option)}
              sx={(theme) => ({
                flex: "0 0 auto",
                width: "25%",
                cursor: "pointer",
                scrollSnapAlign: "start",
                border: isSelected
                  ? `3px solid ${theme.palette.primary.main}`
                  : `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                boxShadow: isSelected
                  ? "0 4px 12px rgba(25, 118, 210, 0.3)" // 選択時：青っぽい影
                  : "0 2px 6px rgba(0, 0, 0, 0.1)",
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
                  transform: "scale(1.05)",
                  borderColor: theme.palette.primary.main,
                },
                mb: 0, // ✅ 下方向の余白リセット
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
                {option.image ? (
                  <>
                    <CardMedia
                      component="img"
                      image={option.image}
                      alt={option.name}
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
                      {option.name}
                    </Typography>
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
                  <Paper
                    sx={{
                      position: "fixed",
                      width: "100%", // 画面幅いっぱい
                      height: "100%", // 画面高さいっぱい
                      display: "flex", // 中央配置用
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "primary.light",
                      boxShadow: 0, // 影を消したい場合
                      borderRadius: 0, // 角丸もなくす
                      zIndex: 9999, // 他の要素より上に表示
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "primary.contrastText",
                      }}
                    >
                      なし
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>
    </>
  );
}
