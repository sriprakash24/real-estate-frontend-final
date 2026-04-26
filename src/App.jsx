import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import MyInquiriesPage from './pages/MyInquiriesPage';
import SellerDashboard from './pages/SellerDashboard';
import AddPropertyPage from './pages/AddPropertyPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />

          {/* Buyer Protected */}
          <Route path="/my-inquiries" element={
            <ProtectedRoute allowedRoles={['BUYER']}>
              <MyInquiriesPage />
            </ProtectedRoute>
          } />

          {/* Seller / Agent Protected */}
          <Route path="/seller-dashboard" element={
            <ProtectedRoute allowedRoles={['SELLER', 'AGENT']}>
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seller/add-property" element={
            <ProtectedRoute allowedRoles={['SELLER', 'AGENT']}>
              <AddPropertyPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
