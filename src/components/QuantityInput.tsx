import { Box, Typography, TextField, InputAdornment, Paper } from '@mui/material';

interface QuantityInputProps {
  quantity: number
  onChange: (quantity: number) => void
}

export default function QuantityInput({ quantity, onChange }: QuantityInputProps) {
  return (
<Box sx={{ my: 2 }}>
  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
    本数を入力してください
  </Typography>

  <TextField
    type="number"
    value={quantity}
    onChange={(e) => onChange(Math.max(1, Number.parseInt(e.target.value, 10) || 1))}
    inputProps={{ min: 1 }}
    fullWidth
    placeholder="本数を入力"
    variant="outlined"
    sx={{
      '& .MuiOutlinedInput-root': {
        borderRadius: 2
      }
    }}
  />
</Box>
  )
}

