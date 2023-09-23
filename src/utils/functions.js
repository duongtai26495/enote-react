import jwt_decode from "jwt-decode";
import { SELECTED_SORT, SELECTED_TASK_SORT, access_token, baseURL, currentNavItem, currentWs, localUser, refresh_token } from "../utils/constants"

import axios from "axios";
import { formatDistanceToNow, parse, getTime } from 'date-fns';
import Cookies from "js-cookie";

export const loadNavigationItem = (item) => {
  localStorage.setItem("current-nav-item", item)
}

export const checkToken = (accessToken) => {

  if (accessToken) {
    try {
      const decoded = jwt_decode(accessToken)
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp > currentTime) {
        // Xử lý khi token đã hết hạn, ví dụ như đăng xuất người dùng
        return true
      }
      else {
        console.log("Token hết hạn")
      }
    } catch (error) {
      console.error('Lỗi xác minh token:', error);
      // Xử lý khi có lỗi xác minh token
    }
  }
  return false
}
export const fetchApiData = async (endpoint, access_token = null, method = 'GET', data = null) => {
  const url = `${baseURL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (access_token) {
    headers['Authorization'] = `Bearer ${access_token}`;
  }

  const config = {
    method,
    url,
    headers,
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const uploadDataFileApi = async (endpoint, access_token, method = 'POST', data = null) => {
  const url = `${baseURL}${endpoint}`
  const config = {
    method,
    url,
    maxBodyLength: Infinity,
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
    },
    data,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return error.response
  }
};


export const getTheTime = (time) => {
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const timestamp = time
  const parsedDate = parse(timestamp, 'dd/MM/yy hh:mm:ss aa', new Date())

  const milliseconds = getTime(parsedDate);
  const timeAgo = formatDistanceToNow(milliseconds, { addSuffix: true })
  return capitalize(timeAgo)
}

export const logoutAccount = () => {
  Cookies.remove(access_token)
  localStorage.removeItem(localUser)
  localStorage.removeItem(currentWs)
  localStorage.removeItem(SELECTED_TASK_SORT)
  localStorage.removeItem(refresh_token)
  localStorage.removeItem(SELECTED_SORT)
  Cookies.remove(access_token)
}