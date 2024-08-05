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
              <TableCell>사용자 이메일</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>성별</TableCell>
              <TableCell>생년월일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.memberId}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserList;
