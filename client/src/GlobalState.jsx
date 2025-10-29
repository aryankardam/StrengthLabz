import { createContext, useEffect, useState } from "react";
import ProductAPI from "./api/ProductAPI";
import CategoryAPI from "./api/CategoryAPI";
import InspectState from "./api/InspectState";
import axios from "./utils/AxiosConfig";
import UserAPI from "./api/UserAPI";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  // Add this effect to sync token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken && !token) {
      console.log('Setting token from localStorage:', storedToken);
      setToken(storedToken);
    }
  }, []);
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshToken = async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshing) {
      console.log('Already refreshing token, skipping...');
      return;
    }

    setIsRefreshing(true);
    
    try {
      console.log('Attempting to refresh token...');
      console.log('Cookies:', document.cookie); // Debug: Check if cookies exist
      
      const res = await axios.get('/api/auth/refresh_token', {
        withCredentials: true,
        timeout: 10000,
      });
      
      console.log('Token refresh successful:', res.data);
      const accessToken = res.data.accessToken || res.data.accesstoken;
      setToken(accessToken);
      
      // Store the token in localStorage for the axios interceptor
      localStorage.setItem('accessToken', accessToken);
      
    } catch (err) {
      console.log('Token refresh failed:', {
        status: err.response?.status,
        message: err.message,
        data: err.response?.data
      });
      
      // Handle different error scenarios
      if (err.response?.status === 401) {
        console.log('401 Unauthorized - clearing stored login state');
        // Clear any existing token and stored login state
        setToken(false);
        localStorage.removeItem('firstLogin');
        localStorage.removeItem('accessToken');
        
        // Optional: Redirect to login page
        // window.location.href = '/login';
      } else if (err.code === 'ECONNABORTED') {
        console.log('Token refresh timed out');
      } else {
        console.log('Network error during token refresh');
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    const existingToken = localStorage.getItem('accessToken');
    
    console.log('Main useEffect - firstLogin:', firstLogin);
    console.log('Main useEffect - existingToken:', existingToken);
    console.log('Main useEffect - current token state:', token);
    
    // Only try to refresh if user was previously logged in AND no token exists AND no existing token in localStorage
    if (firstLogin && !token && !isRefreshing && !existingToken) {
      console.log('Attempting token refresh...');
      refreshToken();
    } else {
      console.log('Skipping token refresh - conditions not met');
    }
  }, [token]); // Add token as dependency to react to token changes

  // Get the UserAPI hook result
  const userAPIResult = UserAPI(token);

  // FIXED: Initialize ProductAPI and CategoryAPI hooks properly
  const productsAPIResult = ProductAPI();
  const categoryAPIResult = CategoryAPI();

  const state = {
    token: [token, setToken],
    refreshToken,
    isRefreshing,
    productsAPI: productsAPIResult, // Pass the complete hook result
    categoryAPI: categoryAPIResult,  // Pass the complete hook result
    UserAPI: userAPIResult
  };

  console.log('GlobalState render - token:', token, 'isRefreshing:', isRefreshing);
  console.log('UserAPI result:', userAPIResult);
  console.log('ProductsAPI result:', productsAPIResult); // Debug log

  return (
    <GlobalState.Provider value={state}>
      {/* Place InspectState separately so it logs but also renders children */}
      <InspectState />
      {children}
    </GlobalState.Provider>
  );
};