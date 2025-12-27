import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import Booking from './components/Booking';
import Footer from './components/Footer';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import ProtectedRoute from './components/admin/ProtectedRoute';
import GalleryPage from './components/GalleryPage';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin/') || location.pathname === '/admin';
  const isAdminLogin = location.pathname === '/admin/login';
  
  return (
    <ScrollToTop>
    <div className="App">
      {!isAdminRoute && !isAdminLogin && <Header />}
      <main className={isAdminRoute || isAdminLogin ? '' : 'min-h-screen bg-gradient-to-br from-neutral-50 to-rose-50'}>
        <Routes>
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <Hero />
              <Services />
              <Gallery />
              <About />
              <Contact />
            </motion.div>
          } />
          <Route path="/booking" element={<Booking />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isAdminRoute && !isAdminLogin && <Footer />}
    </div>
    </ScrollToTop>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;