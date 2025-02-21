import { Box, Checkbox, FormControlLabel, FormGroup, Paper, Typography } from "@mui/material"
import type { Option } from "../data/data"
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        オプションを選択してください
      </Typography>
    
      <FormGroup>
        {options.map((option) => {
          const isSelected = selectedOptions.some((o) => o.name === option.name);
    
          return (
            <Box
              key={option.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                mb: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'grey.300',
                backgroundColor: isSelected ? 'grey.300' : 'transparent',
                transition: 'background-color 0.3s, border-color 0.3s',
                '&:hover': {
                  backgroundColor: isSelected ? 'grey.300' : 'transparent',
                  borderColor: 'primary.main',
                  cursor: 'pointer'
                }
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxOutlineBlankIcon />}
                    checkedIcon={<CheckBoxIcon />}
                    checked={isSelected}
                    onChange={() => handleOptionChange(option)}
                    sx={{
                      zIndex: 1, // アイコンが背景の上に来るようにする
                      '&:hover': {
                        backgroundColor: 'transparent' // ホバー時の背景色を無効化
                      }
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {option.name}
                  </Typography>
                }
                sx={{ flex: 1 }}
              />
              <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
                ¥{option.price.toLocaleString()}
              </Typography>
            </Box>
          );
        })}
      </FormGroup>
    </Box>
  )
}

