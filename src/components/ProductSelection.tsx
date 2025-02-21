"use client"

import {  useMemo, useState } from "react"
import { Button, Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, IconButton, TableHead, Table, TableCell, TableRow, TableBody, Chip, Paper, ListItemAvatar, Avatar, Box } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Product } from "../data/data"
import { useTable } from "react-table";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ProductSelectionProps {
  products: Product[]
  selectedProduct: Product | null
  onSelect: (product: Product) => void
}

export default function ProductSelection({ products, selectedProduct, onSelect }: ProductSelectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : products.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < products.length - 1 ? prevIndex + 1 : 0))
  }

  const currentProduct = products[currentIndex]

  const data = useMemo(
    () =>
      currentProduct.priceRanges.map((range: { minQuantity: any; maxQuantity: any; price: number }) => ({
        quantity: `${range.minQuantity}${range.maxQuantity ? ` 〜 ${range.maxQuantity}` : " 〜"}本`,
        priceExcl: `¥${range.price.toLocaleString()}`,
        priceIncl: `¥${(range.price * 1.1).toLocaleString()}`,
      })),
    [currentProduct.priceRanges]
  );

  const columns = useMemo(
    () => [
      { Header: "本数", accessor: "quantity" as const },
      { Header: "税抜き価格", accessor: "priceExcl" as const },
      { Header: "税込み価格", accessor: "priceIncl" as const },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data ?? [],
  });


  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ position: "relative" }}>
      <CardMedia
        component="img"
        height="400"
        image={currentProduct.image}
        alt={currentProduct.name}
        sx={{
          objectFit: 'contain',
          width: '100%',
          height: '400px',
        }}
      />
        <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
        <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {currentProduct.name}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" flexWrap="wrap" gap={2} sx={{ py: 2 }}>
          <Chip label={currentProduct.led} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
          <Chip label={currentProduct.alcohol} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
          <Chip label={currentProduct.volume} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
          <Chip label={currentProduct.origin} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          価格表
        </Typography>
        <Table {...getTableProps()} sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            {headerGroups.map((headerGroup: any, index: number) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column: any) => (
                  <TableCell
                  {...column.getHeaderProps()}
                  sx={{ width: `${100 / headerGroup.headers.length}%`, textAlign: 'center' }}
                >
                  {column.render("Header")}
                </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {rows.map((row: any, index: number) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={index}>
                  {row.cells.map((cell: any) => (
                    <TableCell
                      {...cell.getCellProps()}
                      sx={{ width: `${100 / row.cells.length}%`, textAlign: 'center' }}
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Typography variant="h6" sx={{ mt: 2 }}>
          種類
        </Typography>
        <List>
          {currentProduct.varieties.map((variety: any, index: number) => (
            <Paper key={index} sx={{ mb: 2, p: 0, borderRadius: 2, boxShadow: 3 }}>
              <ListItem>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: 'gray.100', fontSize: 14,}}>
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {variety.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {variety.description}
                    </Typography>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
        {currentProduct.description && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderLeft: '4px solid #1976d2', // 強調のための左側のライン
              backgroundColor: '#f5f5f5', // 柔らかい背景色
              borderRadius: 2, // 角丸
              boxShadow: 1, // 軽い影
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5
            }}
          >
            <InfoOutlinedIcon sx={{ color: '#1976d2', mt: 0.5 }} /> {/* アイコン */}
            <Box>
              {currentProduct.description.split(/\r\n|\n|\r/).map((line, index) => (
                <Typography key={index} variant="body1" sx={{ lineHeight: 1.6 }}>
                  {line}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
        <Button
          variant="contained"
          onClick={() => onSelect(currentProduct)}
          disabled={selectedProduct?.name === currentProduct.name}
          sx={{ mt: 2 }}
        >
          選択
        </Button>
      </CardContent>
    </Box>
  )
}
