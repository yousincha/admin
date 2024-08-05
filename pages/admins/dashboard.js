import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import OrderList from "./orderlist";
import UserList from "./userlist";

const Dashboard = () => {
  const router = useRouter();
  const [paymentsInfos, setPaymentsInfos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerTel, setBuyerTel] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("name");
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [view, setView] = useState("none"); // "orders", "users", 또는 "none"

  // 상태 정의
  const [loginInfo, setLoginInfo] = useState({
    accessToken: null,
    refreshToken: null,
  });

  // 클라이언트 사이드에서만 localStorage 접근
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      setLoginInfo({
        accessToken,
        refreshToken,
      });
    } else {
      router.push("/admins/login");
    }
  }, [router]);

  // 토큰 갱신 함수
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/admins/refreshToken",
        {
          refreshToken: loginInfo.refreshToken,
        }
      );
      if (response.status === 200) {
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        setLoginInfo((prev) => ({ ...prev, accessToken }));
        return accessToken;
      }
    } catch (error) {
      console.error("Failed to refresh access token", error);
      return null;
    }
  };

  // 결제 정보 가져오기
  const fetchPaymentsInfos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/paymentInfos", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });
      setPaymentsInfos(response.data);
      setFilteredPayments(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          await fetchPaymentsInfos();
        } else {
          router.push("/admins/login");
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/members", {
        headers: {
          Authorization: `Bearer ${loginInfo.accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          await fetchUsers();
        } else {
          router.push("/admins/login");
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (loginInfo.accessToken) {
      fetchPaymentsInfos();
      fetchUsers();
    }
  }, [loginInfo]);

  // 필터링 로직
  useEffect(() => {
    const filtered = paymentsInfos.filter((payment) => {
      if (searchCriteria === "name") {
        return buyerName ? payment.buyerName.includes(buyerName) : true;
      } else if (searchCriteria === "tel") {
        return buyerTel ? payment.buyerTel.includes(buyerTel) : true;
      }
      return true;
    });
    setFilteredPayments(filtered);
  }, [buyerName, buyerTel, paymentsInfos, searchCriteria]);

  const formatPhoneNumber = (value) => {
    const cleaned = ("" + value).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,3})(\d{0,4})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join("-");
    }
    return value;
  };

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setBuyerTel(formattedValue);
  };

  const handleSearchCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "decimal",
      currency: "KRW",
    }).format(amount);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ marginTop: 4 }}>
          <Alert severity="error">Error: {error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          onClick={() => setView(view === "orders" ? "none" : "orders")}
        >
          주문 조회
        </Button>
        <Button
          variant="contained"
          onClick={() => setView(view === "users" ? "none" : "users")}
          style={{ marginLeft: "10px" }}
        >
          사용자 조회
        </Button>
        {view === "orders" && (
          <OrderList
            searchCriteria={searchCriteria}
            handleSearchCriteriaChange={handleSearchCriteriaChange}
            buyerName={buyerName}
            setBuyerName={setBuyerName}
            buyerTel={buyerTel}
            handlePhoneChange={handlePhoneChange}
            filteredPayments={filteredPayments}
            formatCurrency={formatCurrency}
          />
        )}
        {view === "users" && <UserList users={users} />}
      </Box>
    </Container>
  );
};

export default Dashboard;
