const API_BASE_URL = 'http://localhost:8080/api';

const apiCall = async (endpoint, method = 'GET', data = null, requiresAuth = true) => {
  const token = localStorage.getItem('jwtToken');
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText || response.statusText };
      }
      if (response.status === 401) {
          console.error('Authentication failed. Logging out...');
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
      }
      throw new Error(errorData.message || 'Something went wrong on the server.');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const registerUser = (username, password) => apiCall('/auth/register', 'POST', { username, password }, false);
export const loginUser = (username, password) => apiCall('/auth/login', 'POST', { username, password }, false);
export const getStocks = () => apiCall('/stocks');
export const getUserPortfolio = () => apiCall('/portfolio');
export const getUserCash = () => apiCall('/user/cash');
export const buyStock = (stockId, quantity) => apiCall('/trade/buy', 'POST', { stockId, quantity });
export const sellStock = (stockId, quantity) => apiCall('/trade/sell', 'POST', { stockId, quantity });
export const getTransactions = () => apiCall('/transactions');