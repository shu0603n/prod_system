import {
  Box,
  Stack,
  Button,
  Tooltip,
  Snackbar,
  SnackbarContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopy from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import TotalCalculation from "./TotalCalculation";

export default function EstimateModal({ orders, handleCopyEstimate }: any) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ✅ 有効化条件
  const isEnabled = orders.some((order: any) => {
    return (
      order.product &&
      order.quantity > 5 &&
      order.product.varieties?.some((v: any) => v.selected === true)
    );
  });

  return (
    <>
      {/* ✅ トリガーボタン */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          disabled={!isEnabled} // ← 条件を満たさないと無効化
          sx={{
            py: 1.5,
            px: 4,
            fontWeight: "bold",
            borderRadius: 3,
            textTransform: "none",
            opacity: !isEnabled ? 0.6 : 1, // 見た目で分かるように薄く
            cursor: !isEnabled ? "not-allowed" : "pointer",
            transition: "0.2s",
          }}
        >
          見積りを確認する
        </Button>
      </Box>

      {/* ✅ モーダル */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          お見積り内容
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <TotalCalculation orders={orders} />

          {/* ✅ 2つのボタンを横並びで50%ずつ */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            {/* LINE相談ボタン */}
            <Button
              variant="contained"
              color="success"
              href="https://line.me/R/ti/p/@367ihugx?from=page&accountId=367ihugx"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                flex: 1,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: 3,
                textTransform: "none",
                backgroundColor: "#06C755",
                "&:hover": {
                  backgroundColor: "#05b24a",
                },
              }}
              startIcon={<ShareIcon fontSize="small" />}
            >
              LINEで相談する
            </Button>

            {/* 見積コピー */}
            <Tooltip title="見積内容をコピー" arrow sx={{ flex: 1 }}>
              <Button
                onClick={() => {
                  handleCopyEstimate();
                  setCopied(true);
                }}
                variant="contained"
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  borderRadius: 3,
                  textTransform: "none",
                  backgroundColor: "#1e1e1e",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#333" },
                }}
                startIcon={<ContentCopy fontSize="small" />}
              >
                見積をコピーする
              </Button>
            </Tooltip>
          </Stack>

          {/* ✅ コピー完了スナックバー */}
          <Snackbar
            open={copied}
            autoHideDuration={2500}
            onClose={() => setCopied(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <SnackbarContent
              sx={{
                backgroundColor: "primary.light",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
              }}
              message="見積内容をコピーしました！"
            />
          </Snackbar>
        </DialogContent>
      </Dialog>
    </>
  );
}
