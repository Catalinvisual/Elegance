import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Users, Eye, Plus, Trash2, Edit3, Calendar, CheckCircle } from 'lucide-react';

interface Newsletter {
  id: number;
  subject: string;
  content: string;
  recipients: number;
  sentAt: string | null;
  status: 'draft' | 'sent' | 'scheduled';
  createdAt: string;
}

// interface Subscriber {
//   id: number;
//   email: string;
//   name: string;
//   isActive: boolean;
//   subscribedAt: string;
// }

const NewsletterManager: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  // const [subscribers, setSubscribers] = useState<Subscriber[]>([]); // Not currently used
  // const [loading, setLoading] = useState(true); // Not currently used
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(null);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    status: 'draft' as 'draft' | 'sent' | 'scheduled',
  });

  // Stats
  const [stats, setStats] = useState({
    totalSubscribers: 0,
    activeSubscribers: 0,
    sentNewsletters: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    fetchNewsletters();
    // fetchSubscribers(); // Not currently used
    fetchStats();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/newsletters', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setNewsletters(data);
      }
    } catch (error) {
      console.error('Error fetching newsletters:', error);
    }
  };

  // const fetchSubscribers = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/subscribers', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  //       },
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setSubscribers(data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching subscribers:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/newsletters/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingNewsletter 
        ? `http://localhost:5000/api/newsletters/${editingNewsletter.id}`
        : 'http://localhost:5000/api/newsletters';
      
      const method = editingNewsletter ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchNewsletters();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving newsletter:', error);
    }
  };

  const handleSend = async (id: number) => {
    if (window.confirm('Are you sure you want to send this newsletter to all subscribers?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/newsletters/${id}/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        if (response.ok) {
          fetchNewsletters();
          fetchStats();
        }
      } catch (error) {
        console.error('Error sending newsletter:', error);
      }
    }
  };

  const handlePreview = (newsletter: Newsletter) => {
    setPreviewNewsletter(newsletter);
    setShowPreviewModal(true);
  };

  const handleEdit = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    setFormData({
      subject: newsletter.subject,
      content: newsletter.content,
      status: newsletter.status,
    });
    setShowComposeModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this newsletter?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/newsletters/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });

        if (response.ok) {
          fetchNewsletters();
        }
      } catch (error) {
        console.error('Error deleting newsletter:', error);
      }
    }
  };

  const resetForm = () => {
    setShowComposeModal(false);
    setEditingNewsletter(null);
    setFormData({
      subject: '',
      content: '',
      status: 'draft',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex justify-between items-center"
      >
        <div>
          <h2 className="text-3xl font-display font-bold text-neutral-800 mb-2">Newsletter Management</h2>
          <p className="text-neutral-600">Create and send newsletters to your subscribers</p>
        </div>
        <button
          onClick={() => setShowComposeModal(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Compose Newsletter</span>
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Subscribers</p>
              <p className="text-3xl font-bold text-neutral-800">{stats.totalSubscribers}</p>
            </div>
            <Users className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Active Subscribers</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeSubscribers}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Sent Newsletters</p>
              <p className="text-3xl font-bold text-blue-600">{stats.sentNewsletters}</p>
            </div>
            <Send className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">This Month</p>
              <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </motion.div>

      {/* Newsletters List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm"
      >
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-800">Recent Newsletters</h3>
        </div>
        <div className="divide-y divide-neutral-200">
          {newsletters.map((newsletter, index) => (
            <motion.div
              key={newsletter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-neutral-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-neutral-800">{newsletter.subject}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(newsletter.status)}`}>
                      {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-neutral-600 mb-3 line-clamp-2">
                    {newsletter.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-500">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {newsletter.recipients} recipients
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(newsletter.createdAt).toLocaleDateString()}
                    </span>
                    {newsletter.sentAt && (
                      <span className="flex items-center">
                        <Send className="w-4 h-4 mr-1" />
                        {new Date(newsletter.sentAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handlePreview(newsletter)}
                    className="text-neutral-600 hover:text-neutral-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {newsletter.status === 'draft' && (
                    <>
                      <button
                        onClick={() => handleEdit(newsletter)}
                        className="text-neutral-600 hover:text-neutral-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSend(newsletter.id)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(newsletter.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                {editingNewsletter ? 'Edit Newsletter' : 'Compose Newsletter'}
              </h3>
              <button
                onClick={resetForm}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter newsletter subject..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={10}
                  placeholder="Write your newsletter content here... You can use HTML tags for formatting."
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-neutral-200 text-neutral-800 py-2 px-4 rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewNewsletter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neutral-800">Newsletter Preview</h3>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewNewsletter(null);
                }}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>

            <div className="border border-neutral-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-neutral-800 mb-4">{previewNewsletter.subject}</h2>
              <div 
                className="prose max-w-none text-neutral-700"
                dangerouslySetInnerHTML={{ __html: previewNewsletter.content }}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewNewsletter(null);
                }}
                className="flex-1 bg-neutral-200 text-neutral-800 py-2 px-4 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManager;