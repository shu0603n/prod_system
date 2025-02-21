import { Box, Button } from "@mui/material"

interface AddOrderButtonProps {
  onClick: () => void
}

export default function AddOrderButton({ onClick }: AddOrderButtonProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // 水平方向の中央揃え
        alignItems: 'center', // 垂直方向の中央揃え
        mt: 4 // ボタンの上に余白
      }}
    >
      <Button
        variant="contained"
        onClick={onClick}
        sx={{
          mt: 2,
          px: 4, // 横の余白を広くしてボタンを大きく
          py: 2, // 縦の余白を広く
          fontSize: '1.2rem', // フォントサイズを大きく
          borderRadius: 2, // ボタンの角丸を強調
          textTransform: 'none' // テキストをそのまま表示（大文字変換を防ぐ）
        }}
      >
        🥂 もう一本のシャンパンを追加する
      </Button>
    </Box>
  )
}

