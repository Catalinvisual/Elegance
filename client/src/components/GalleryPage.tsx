import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X } from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  description: string;
  category: string;
}

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        const data = await response.json();
        
        // Handle both array and object responses
        const imagesArray = Array.isArray(data) ? data : (data.images || []);
        
        // Ensure we have valid data
        if (!imagesArray || !Array.isArray(imagesArray)) {
          throw new Error('Invalid data format from API');
        }
        
        setImages(imagesArray);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Fallback to mock images if API fails
        const mockImages: GalleryImage[] = [
          {
            id: 1,
            url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
            title: 'Luxury Facial Treatment',
            description: 'Professional facial treatment',
            category: 'services'
          },
          {
            id: 2,
            url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
            title: 'Hair Styling',
            description: 'Professional hair services',
            category: 'services'
          },
          {
            id: 3,
            url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
            title: 'Massage Therapy',
            description: 'Relaxing massage treatments',
            category: 'services'
          },
          {
            id: 4,
            url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
            title: 'Nail Services',
            description: 'Professional nail care',
            category: 'services'
          },
          {
            id: 5,
            url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
            title: 'Makeup Services',
            description: 'Professional makeup application',
            category: 'services'
          },
          {
            id: 6,
            url: 'https://images.unsplash.com/photo-1596178065887-1198b8b79843?w=800',
            title: 'Spa Interior',
            description: 'Relaxing spa environment',
            category: 'interior'
          },
          {
            id: 7,
            url: 'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?w=800',
            title: 'Hair Color Treatment',
            description: 'Professional hair coloring services',
            category: 'services'
          },
          {
            id: 8,
            url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800',
            title: 'Beauty Products',
            description: 'High-quality beauty products we use',
            category: 'products'
          }
        ];
        setImages(mockImages);
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  const categories = ['all', 'services', 'interior', 'products', 'team', 'results'];
  
  // Ensure images is always an array before filtering
  const safeImages = Array.isArray(images) ? images : [];
  
  const filteredImages = filter === 'all' 
    ? safeImages 
    : safeImages.filter(image => image && image.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20 sm:pt-24 md:pt-28">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center mb-4">
              <Camera className="w-6 sm:w-8 h-6 sm:h-8 text-primary-600 mr-2 sm:mr-3" />
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800">Our Gallery</h1>
            </div>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Loading our gallery images...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 sm:pt-24 md:pt-28">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-6 sm:w-8 h-6 sm:h-8 text-primary-600 mr-2 sm:mr-3" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800">Our Gallery</h1>
          </div>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore our beauty salon through these stunning images showcasing our services, facilities, and happy clients
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 sm:px-4 py-2 rounded-full font-medium transition-colors text-sm sm:text-base ${
                filter === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="relative group overflow-hidden rounded-xl sm:rounded-2xl shadow-lg cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-1">{image.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{image.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <Camera className="w-12 sm:w-16 h-12 sm:h-16 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 text-base sm:text-lg">No images found in this category.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-full max-h-full w-full sm:max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors z-10"
            >
              <X className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 sm:p-6 rounded-b-lg">
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedImage.title}</h3>
              <p className="text-white/90 text-sm sm:text-base">{selectedImage.description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;