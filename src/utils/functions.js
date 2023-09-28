import jwt_decode from "jwt-decode";
import { SELECTED_SORT, SELECTED_TASK_SORT, ACCESS_TOKEN, URL_PREFIX, currentNavItem, CURRENT_WS, LOCAL_USER, REFRESH_TOKEN } from "../utils/constants"

import axios from "axios";
import { formatDistanceToNow, parse, getTime } from 'date-fns';
import Cookies from "js-cookie";

export const loadNavigationItem = (item) => {
  localStorage.setItem("current-nav-item", item)
}

export const checkActivateUser = async (token) => {
  return await fetchApiData("public/check-activate-user", token)
}

export const checkToken = (accessToken) => {

  if (accessToken) {
    try {
      const decoded = jwt_decode(accessToken)
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp > currentTime) {
        return true
      }
      else {
        console.log("Token hết hạn")
      }
    } catch (error) {
      console.error('Lỗi xác minh token: ', error);
    }
  }
  return false
}
export const fetchApiData = async (endpoint, ACCESS_TOKEN = null, method = 'GET', data = null) => {
  const url = `${URL_PREFIX}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
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

export const uploadDataFileApi = async (endpoint, ACCESS_TOKEN, method = 'POST', data = null) => {
  const url = `${URL_PREFIX}${endpoint}`
  const config = {
    method,
    url,
    maxBodyLength: Infinity,
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
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

export const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};


export const logoutAccount = () => {
  Cookies.remove(ACCESS_TOKEN)
  localStorage.removeItem(LOCAL_USER)
  localStorage.removeItem(CURRENT_WS)
  localStorage.removeItem(SELECTED_TASK_SORT)
  localStorage.removeItem(REFRESH_TOKEN)
  localStorage.removeItem(SELECTED_SORT)
  Cookies.remove(ACCESS_TOKEN)
}