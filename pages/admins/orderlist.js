import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";

const OrderList = ({
  searchCriteria,
  handleSearchCriteriaChange,
  buyerName,
  setBuyerName,
  buyerTel,
  handlePhoneChange,
  filteredPayments,
  formatCurrency,
}) => {
  return (
    <Box sx={{ marginTop: 4 }}>
      <Box sx={{ marginTop: 4, display: "flex", alignItems: "center" }}>
        <FormControl
          variant="outlined"
          sx={{ flex: 1, marginRight: 2 }}
          margin="normal"
        >
          <InputLabel>검색 기준</InputLabel>
          <Select
            value={searchCriteria}
            onChange={handleSearchCriteriaChange}
            label="검색 기준"
          >
            <MenuItem value="name">구매자 이름</MenuItem>
            <MenuItem value="tel">전화</MenuItem>
          </Select>
        </FormControl>
        {searchCriteria === "name" && (
          <TextField
            label="구매자 이름"
            variant="outlined"
            sx={{ flex: 4 }}
            margin="normal"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
          />
        )}
        {searchCriteria === "tel" && (
          <TextField
            label="전화"
            variant="outlined"
            sx={{ flex: 4 }}
            margin="normal"
            value={buyerTel}
            onChange={handlePhoneChange}
          />
        )}
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>결제 ID</TableCell>
                <TableCell>구매자 이름</TableCell>
                <TableCell>제품 이름</TableCell>
                <TableCell>금액</TableCell>
                <TableCell>결제 방법</TableCell>
                <TableCell>전화</TableCell>
                <TableCell>주소</TableCell>
                <TableCell>우편번호</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.buyerName}</TableCell>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>
                    {formatCurrency(payment.paid_amount) + "원"}
                  </TableCell>
                  <TableCell>{payment.payMethod}</TableCell>
                  <TableCell>{payment.buyerTel}</TableCell>
                  <TableCell>{payment.buyerAddr}</TableCell>
                  <TableCell>{payment.buyerPostcode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default OrderList;
