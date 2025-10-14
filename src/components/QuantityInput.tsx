import { Box, Typography, TextField } from "@mui/material";
import { useState } from "react";

interface QuantityInputProps {
  quantity: number | null;
  onChange: (quantity: number) => void;
}

export default function QuantityInput({
  quantity,
  onChange,
}: QuantityInputProps) {
  const [error, setError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    if (value < 0) {
      setError(true);
      onChange(0); // 自動で0に戻したい場合
    } else {
      setError(false);
      onChange(value);
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
      >
        STEP2 本数を入力
      </Typography>

      <TextField
        type="number"
        value={quantity ?? ""}
        onChange={handleChange}
        fullWidth
        placeholder="本数を入力"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <Typography sx={{ color: "text.secondary", ml: 1 }}>本</Typography>
          ),
        }}
        error={error}
        helperText={error ? "0以上の数値を入力してください" : ""}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
}
