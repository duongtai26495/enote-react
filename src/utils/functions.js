import jwt_decode from "jwt-decode";
import { access_token, baseURL } from "./constants";
import axios from "axios";

export const loadNavigationItem = (item) => {
    localStorage.setItem("current-nav-item", item)
}

export const checkToken = (accessToken) => {

    const secretKey = process.env.SECRET_KEY; // Đảm bảo key này giống với khi bạn đã ký token
    if (accessToken) {
        try {
            const decoded = jwt_decode(accessToken)
            const currentTime = Math.floor(Date.now() / 1000);

            if (decoded.exp > currentTime) {
                // Xử lý khi token đã hết hạn, ví dụ như đăng xuất người dùng
                return true
            }
        } catch (error) {
            console.error('Lỗi xác minh token:', error);
            // Xử lý khi có lỗi xác minh token
        }
    }
    return false
}

export const fetchApiData = async (endpoint, access_token, method = 'GET', data = null) => {
    const url = `${baseURL}${endpoint}`
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      data,
    };
  
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      throw error;
    }
  };
  