"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Fade } from "@mui/material"

interface StepOverlayProps {
  step: number
  text: string
}

export default function StepOverlay({ step, text }: StepOverlayProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    setShow(true)
    const timer = setTimeout(() => {
      setShow(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [step, text])

  return (
    <Fade in={show}>
      <Box
        sx={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 9999,
        }}
      >
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          {`STEP${step}: ${text}`}
        </Typography>
      </Box>
    </Fade>
  )
}

