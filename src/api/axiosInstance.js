import axios from "axios";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:8080/api", // 백엔드 주소 설정
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
