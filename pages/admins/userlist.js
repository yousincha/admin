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
} from "@mui/material";

const UserList = ({ users }) => {
  return (
    <Box sx={{ marginTop: 4 }}>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>이름</TableCell>
              <TableCell>사용자 이메일</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>생년월일</TableCell>
              <TableCell>주소록</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.memberId}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.gender === "M"
                    ? "남자"
                    : user.gender === "F"
                    ? "여자"
                    : "기타"}
                </TableCell>
                <TableCell>
                  {user.birthYear}.{user.birthMonth}.{user.birthDay}
                </TableCell>
                <TableCell>
                  {user.addresses && user.addresses.length > 0
                    ? user.addresses.map((address, index) => (
                        <div
                          key={address.id}
                          style={{
                            marginBottom: "10px",
                            padding: "5px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                          }}
                        >
                          <strong>{index + 1}. 주소록</strong> <br />
                          <strong>수신자:</strong> {address.recipientName}{" "}
                          <br />
                          <strong>전화번호:</strong> {address.recipientPhone}{" "}
                          <br />
                          <strong>주소:</strong> {address.address} <br />
                          <strong>우편번호:</strong> {address.postalCode}
                        </div>
                      ))
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
