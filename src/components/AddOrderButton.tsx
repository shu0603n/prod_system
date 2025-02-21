import { Button } from "@mui/material"

interface AddOrderButtonProps {
  onClick: () => void
}

export default function AddOrderButton({ onClick }: AddOrderButtonProps) {
  return (
    <Button variant="contained" onClick={onClick} sx={{ mt: 2 }}>
      もう一本のシャンパンを追加する
    </Button>
  )
}

