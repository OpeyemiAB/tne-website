import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { GiftingProvider } from './context/GiftingContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportWidget from './components/SupportWidget';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Atelier from './pages/Atelier';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import Unboxing from './pages/Unboxing';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import CustomerLogin from './pages/CustomerLogin';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { FAQs, Shipping, Refunds, Privacy, Terms } from './pages/InfoPages';
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';

import { useGifting } from './context/GiftingContext';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <GiftingProvider>
      <Router>
        <AppContent />
      </Router>
    </GiftingProvider>
  );
}

function AppContent() {
  const { toast } = useGifting();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--background-ivory)' }}>
      {/* Scroll manager */}
      <ScrollToTop />

      {/* Header Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/atelier" element={<Atelier />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<Tracking />} />
          <Route path="/unbox" element={<Unboxing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Informational Pages */}
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Protected Admin dashboard route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>

      {/* Floating WhatsApp and live support chats bubble */}
      <BackToTopButton />
      <SupportWidget />

      {/* Footer details (Hidden on Atelier, Unboxing, Receipt, and Admin) */}
      <ConditionalFooter />

      {/* Custom Toast Alert Pop-up */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#fff',
          border: '2px solid var(--accent-gold)',
          borderRadius: '8px',
          padding: '1rem 2rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 99999,
          animation: 'fadeInUp 0.3s ease-out',
          minWidth: '320px',
          justifyContent: 'center'
        }}>
          <Sparkles size={20} style={{ color: 'var(--accent-gold)' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary-green)', textAlign: 'center' }}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}

// Route-aware footer renderer to prevent clutter on specialized app-like interfaces
function ConditionalFooter() {
  const location = useLocation();
  const hideFooterRoutes = ['/atelier', '/unbox', '/receipt', '/admin', '/admin-login'];
  const shouldHide = hideFooterRoutes.some(route => location.pathname.startsWith(route));
  if (shouldHide) return null;
  return <Footer />;
}
