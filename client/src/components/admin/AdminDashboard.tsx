import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  Image, 
  Mail, 
  Menu, 
  X,
  LogOut,
  Home
} from 'lucide-react';
import ServicesManager from './ServicesManager';
import AppointmentsManager from './AppointmentsManager';
import GalleryManager from './GalleryManager';
import NewsletterManager from './NewsletterManager';
import AdminLogin from './AdminLogin';
import DashboardOverview from './DashboardOverview';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-rose-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'services':
        return <ServicesManager />;
      case 'appointments':
        return <AppointmentsManager />;
      case 'gallery':
        return <GalleryManager />;
      case 'newsletter':
        return <NewsletterManager />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-rose-50">
      <div className="flex h-screen w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-white/90 backdrop-blur-lg border-r border-neutral-200 flex-shrink-0 h-full">
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-display font-bold text-neutral-800">Admin Panel</h2>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            exit={{ x: -100 }}
            transition={{ type: "spring", damping: 20 }}
            className="lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-lg border-r border-neutral-200 z-50 shadow-xl"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-neutral-800">Admin Panel</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="space-y-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-primary-600'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="font-medium text-lg">{item.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="bg-white/90 backdrop-blur-lg border-b border-neutral-200 px-2 sm:px-4 py-3 sticky top-0 z-20">
            <div className="flex items-center justify-between max-w-full">
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 flex-shrink-0"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors font-medium px-2 py-2 rounded-lg hover:bg-neutral-100 flex-shrink-0"
                  title="Go to Home Page"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden sm:inline">Home</span>
                </button>
                {activeTab !== 'dashboard' && (
                  <>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="hidden md:block text-neutral-600 hover:text-primary-600 transition-colors font-medium flex-shrink-0"
                    >
                      ← Back to Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="md:hidden p-2 rounded-lg hover:bg-neutral-100 flex-shrink-0"
                      title="Back to Dashboard"
                    >
                      <span className="text-sm">←</span>
                    </button>
                  </>
                )}
              </div>
              
              <h1 className="text-base sm:text-lg md:text-xl font-display font-bold text-neutral-800 text-center flex-1 mx-2 sm:mx-4 truncate">
                Elegance Studio - Admin
              </h1>
              
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
                <span className="hidden lg:inline text-sm text-neutral-600">Administrator</span>
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Content area */}
          <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto w-full">
            <div className="max-w-full mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};



export default AdminDashboard;