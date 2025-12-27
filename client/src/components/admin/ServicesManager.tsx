import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  Upload,
  Percent,
  Euro,
  Clock,
  Star
} from 'lucide-react';

interface Service {
  id?: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image?: string;
  discount?: number;
  isActive: boolean;
}

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Service>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    category: '',
    discount: 0,
    isActive: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const categories = [
    'Facial Care',
    'Body Care',
    'Massage',
    'Hair Styling',
    'Makeup',
    'Manicure',
    'Pedicure',
    'Special Treatments'
  ];

  useEffect(() => {
    // Fetch services from API
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      console.log('Fetching services...');
      const response = await fetch('http://localhost:5000/api/services');
      console.log('Services response status:', response.status);
      
      const data = await response.json();
      console.log('Services data:', data);
      
      // Handle both { services: [...] } and direct array responses
      const servicesData = data.services || data;
      
      if (Array.isArray(servicesData)) {
        setServices(servicesData);
      } else {
        console.error('Services data is not an array:', servicesData);
        setServices([]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Mock data for development
      console.log('Using mock data due to error');
      setServices([
        {
          id: 1,
          name: 'Hydrating Facial Treatment',
          description: 'Deeply hydrating treatment for all skin types',
          price: 150,
          duration: 60,
          category: 'Facial Care',
          discount: 10,
          isActive: true
        },
        {
          id: 2,
          name: 'Relaxation Massage',
          description: 'Therapeutic massage for stress relief',
          price: 200,
          duration: 90,
          category: 'Massage',
          isActive: true
        }
      ]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key as keyof Service] as string);
    });
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const url = editingService 
        ? `http://localhost:5000/api/services/${editingService.id}`
        : 'http://localhost:5000/api/services';
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        fetchServices();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 0,
      category: '',
      discount: 0,
      isActive: true
    });
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await fetch(`http://localhost:5000/api/services/${id}`, {
          method: 'DELETE',
        });
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await fetch(`http://localhost:5000/api/services/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchServices();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-800">Services Management</h2>
          <p className="text-neutral-600">Add, edit and manage salon services</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Service</span>
        </motion.button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary-100 to-rose-100 flex items-center justify-center">
                <Star className="w-16 h-16 text-primary-600" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-display font-bold text-neutral-800">{service.name}</h3>
                  <div className="flex items-center space-x-2">
                    {service.discount && service.discount > 0 && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
                        -{service.discount}%
                      </span>
                    )}
                    <button
                      onClick={() => toggleStatus(service.id!, service.isActive)}
                      className={`w-3 h-3 rounded-full ${
                        service.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={service.isActive ? 'Active' : 'Inactive'}
                    />
                  </div>
                </div>
                
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Price:</span>
                    <div className="flex items-center space-x-2">
                      {service.discount && service.discount > 0 && (
                        <span className="text-neutral-400 line-through text-xs">
                          {service.price} €
                        </span>
                      )}
                      <span className="font-bold text-primary-600">
                        {service.discount && service.discount > 0 
                          ? Math.round(service.price * (1 - service.discount / 100))
                          : service.price
                        } €
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Duration:</span>
                    <span className="text-neutral-800">{service.duration} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600">Category:</span>
                    <span className="text-neutral-800">{service.category}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(service)}
                    className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(service.id!)}
                    className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-200 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-display font-bold text-neutral-800">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button
                    onClick={() => resetForm()}
                    className="p-2 rounded-lg hover:bg-neutral-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g.: Hydrating Facial Treatment"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Price (€) *
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="150"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                      <input
                        type="number"
                        required
                        min="15"
                        step="15"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Discount (%)
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount || 0}
                        onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Status
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="isActive" className="text-sm text-neutral-700">
                        Service active
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe the service offered in detail..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Service Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="service-image"
                    />
                    <label
                      htmlFor="service-image"
                      className="flex items-center space-x-2 px-4 py-2 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload image</span>
                    </label>
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="w-5 h-5" />
                    <span>{editingService ? 'Update' : 'Save'}</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => resetForm()}
                    className="px-6 py-3 border border-neutral-300 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServicesManager;