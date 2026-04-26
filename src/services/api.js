import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// Properties
export const getAllProperties = (params) => API.get('/properties', { params });
export const getPropertyById = (id) => API.get(`/properties/${id}`);
export const searchProperties = (params) => API.get('/properties/search', { params });
export const getFeaturedProperties = () => API.get('/properties/featured');

// Inquiries
export const submitInquiry = (data) => API.post('/inquiries', data);
export const getBuyerInquiries = () => API.get('/inquiries/buyer');
export const getSellerInquiries = () => API.get('/inquiries/seller');
export const updateInquiryStatus = (id, status) => API.patch(`/inquiries/${id}/status`, null, { params: { status } });

// Seller — Property Management
export const addProperty = (data) => API.post('/properties', data);
export const deleteProperty = (id) => API.delete(`/properties/${id}`);

export default API;
