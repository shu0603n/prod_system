"use client"

import {  useEffect, useMemo, useState } from "react"
import { Button, Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, IconButton, TableHead, Table, TableCell, TableRow, TableBody, Chip, Paper, ListItemAvatar, Avatar, Box, AccordionDetails, Accordion, AccordionSummary } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { Product } from "../data/data"
import { useTable } from "react-table";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CheckCircleIcon } from "lucide-react"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

  const preloadImages = (products: any) => {
    products.forEach((product: any) => {
      const img = new Image();
      img.src = product.image;
    });
  };
  
  useEffect(() => {
    preloadImages(products);
  }, []);


  return (
    <>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        ボトルを選択してください
      </Typography>
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
                border: "1px solid gray",
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
                border: "1px solid gray",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.9)" },
              }}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
          <CardContent>
          <Typography gutterBottom variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            {currentProduct.name}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" flexWrap="wrap" gap={2} sx={{ py: 2 }}>
            <Chip label={currentProduct.led} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
            <Chip label={currentProduct.alcohol} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
            <Chip label={currentProduct.volume} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
            <Chip label={currentProduct.origin} sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }} />
          </Box>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="price-table-content"
              id="price-table-header"
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold'}}>
                価格表
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Table {...getTableProps()} sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  {headerGroups.map((headerGroup: any, index: number) => (
                    <TableRow {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers.map((column: any) => (
                        <TableCell
                          {...column.getHeaderProps()}
                          sx={{ width: `${100 / headerGroup.headers.length}%`, textAlign: 'center', paddingLeft:1, paddingRight:1, paddingTop:2, paddingBottom:2}}
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
                            sx={{ width: `${100 / row.cells.length}%`, textAlign: 'center', paddingLeft:1, paddingRight:1, paddingTop:2, paddingBottom:2 }}
                          >
                            {cell.render("Cell")}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="price-table-content"
              id="price-table-header"
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              種類
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <List>
                {currentProduct.varieties.map((variety: any, index: number) => (
                  <ListItem>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 30, height: 30, bgcolor: 'gray.100', fontSize: 14,}}>
                        {index + 1}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                          {variety.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                          {variety.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          {currentProduct.description && (
            <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="price-table-content"
              id="price-table-header"
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                詳細
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 4, // 親要素に余白を追加（必要に応じて調整）
            }}
          >
            <Button
              variant="contained"
              onClick={() => onSelect(currentProduct)}
              disabled={selectedProduct?.name === currentProduct.name}
              endIcon={selectedProduct?.name === currentProduct.name ? <CheckCircleIcon /> : <ArrowForwardIcon />}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 'bold',
                borderRadius: '12px',
                background: selectedProduct?.name === currentProduct.name
                  ? 'linear-gradient(45deg, #66bb6a, #43a047)'
                  : 'linear-gradient(45deg, #42a5f5, #1e88e5)',
                color: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: selectedProduct?.name === currentProduct.name
                    ? 'linear-gradient(45deg, #43a047, #2e7d32)'
                    : 'linear-gradient(45deg, #1e88e5, #1565c0)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
                },
                '&:disabled': {
                  background: 'linear-gradient(45deg, #bdbdbd, #9e9e9e)',
                  color: '#eeeeee',
                  boxShadow: 'none',
                },
              }}
            >
              {selectedProduct?.name === currentProduct.name ? '選択済み' : 'このボトルを選択'}
            </Button>
          </Box>
        </CardContent>
      </Box>
    </>
  )
}
