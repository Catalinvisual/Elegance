import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  description: string;
  category: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewMoreClick = () => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery images');
        }
        const data = await response.json();
        // Show only first 6 images on main page
        setImages(data.images.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gallery images:', error);
        // Fallback to mock images if API fails
        const mockImages: GalleryImage[] = [
          {
            id: 1,
            url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
            title: 'Luxury Facial Treatment',
            description: 'Professional facial treatment',
            category: 'services'
          },
          {
            id: 2,
            url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
            title: 'Hair Styling',
            description: 'Professional hair services',
            category: 'services'
          },
          {
            id: 3,
            url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
            title: 'Massage Therapy',
            description: 'Relaxing massage treatments',
            category: 'services'
          },
          {
            id: 4,
            url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400',
            title: 'Nail Services',
            description: 'Professional nail care',
            category: 'services'
          },
          {
            id: 5,
            url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
            title: 'Makeup Services',
            description: 'Professional makeup application',
            category: 'services'
          },
          {
            id: 6,
            url: 'https://images.unsplash.com/photo-1596178065887-1198b8b79843?w=400',
            title: 'Spa Interior',
            description: 'Relaxing spa environment',
            category: 'interior'
          }
        ];
        setImages(mockImages);
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  if (loading) {
    return (
      <section id="gallery" className="py-16 sm:py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-4">Our Gallery</h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Loading our gallery images...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 sm:py-20 bg-neutral-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-6 sm:w-8 h-6 sm:h-8 text-primary-600 mr-2 sm:mr-3" />
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800">Our Gallery</h2>
          </div>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Explore our beauty salon through these stunning images showcasing our services, facilities, and happy clients
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="relative group overflow-hidden rounded-xl sm:rounded-2xl shadow-lg"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h3 className="text-base sm:text-lg font-semibold mb-1">{image.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90">{image.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/gallery"
            onClick={handleViewMoreClick}
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-primary-700 transition-colors group text-sm sm:text-base"
          >
            <span>View More Images</span>
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;