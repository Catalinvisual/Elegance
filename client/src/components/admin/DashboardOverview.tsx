import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, Image, Mail, Users, TrendingUp } from 'lucide-react';

interface DashboardOverviewProps {
  setActiveTab: (tab: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalServices: '0',
    activeAppointments: '0',
    galleryImages: '0',
    newsletterSubscribers: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats');
        const data = await response.json();
        setStats({
          totalServices: data.totalServices.toString(),
          activeAppointments: data.activeAppointments.toString(),
          galleryImages: data.galleryImages.toString(),
          newsletterSubscribers: data.newsletterSubscribers.toString()
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: Package,
      color: 'bg-blue-500',
      onClick: () => setActiveTab('services')
    },
    {
      title: 'Active Appointments',
      value: stats.activeAppointments,
      icon: Calendar,
      color: 'bg-green-500',
      onClick: () => setActiveTab('appointments')
    },
    {
      title: 'Gallery Images',
      value: stats.galleryImages,
      icon: Image,
      color: 'bg-purple-500',
      onClick: () => setActiveTab('gallery')
    },
    {
      title: 'Newsletter Subscribers',
      value: stats.newsletterSubscribers,
      icon: Mail,
      color: 'bg-orange-500',
      onClick: () => setActiveTab('newsletter')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Admin Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what's happening with your salon.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            onClick={card.onClick}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600">{card.title}</p>
                <p className="text-2xl font-bold text-neutral-900">{card.value}</p>
              </div>
              <div className={`${card.color} rounded-full p-3`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('services')}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package className="h-5 w-5 text-blue-600 mr-3" />
            <span className="text-blue-900 font-medium">Manage Services</span>
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Calendar className="h-5 w-5 text-green-600 mr-3" />
            <span className="text-green-900 font-medium">View Appointments</span>
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Image className="h-5 w-5 text-purple-600 mr-3" />
            <span className="text-purple-900 font-medium">Update Gallery</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;