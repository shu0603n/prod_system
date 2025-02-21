import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from "@mui/material"
import type { Option } from "../App"

interface OptionsSelectionProps {
  options: Option[]
  selectedOptions: Option[]
  onSelect: (selectedOptions: Option[]) => void
}

export default function OptionsSelection({ options, selectedOptions, onSelect }: OptionsSelectionProps) {
  const handleOptionChange = (option: Option) => {
    let newSelectedOptions: Option[]
    if (option.name === "なし") {
      newSelectedOptions = [option]
    } else {
      newSelectedOptions = selectedOptions.filter((o) => o.name !== "なし")
      const index = newSelectedOptions.findIndex((o) => o.name === option.name)
      if (index === -1) {
        newSelectedOptions.push(option)
      } else {
        newSelectedOptions.splice(index, 1)
      }
      if (newSelectedOptions.length === 0) {
        newSelectedOptions = [options[0]] // 'なし' オプション
      }
    }
    onSelect(newSelectedOptions)
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        オプションを選択してください
      </Typography>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.name}
            control={
              <Checkbox
                checked={selectedOptions.some((o) => o.name === option.name)}
                onChange={() => handleOptionChange(option)}
              />
            }
            label={`${option.name} (¥${option.price.toLocaleString()})`}
          />
        ))}
      </FormGroup>
    </Box>
  )
}

