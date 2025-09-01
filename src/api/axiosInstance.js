// src/api/axiosInstance.js
import axios from "axios";

const API_BASE_URL = "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000"; // replace with your backend base URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


