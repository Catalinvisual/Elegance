import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, Sparkles, Scissors, Palette, Heart, Hand, User } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string;
}

const Services: React.FC = () => {
  const [services, setServices] = useState<Record<string, Service[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real services from API
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data.services);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to mock data if API fails
        const mockServices: Service[] = [
          {
            id: 1,
            name: 'Luxury Facial Treatment',
            description: 'Deep cleansing, exfoliation, and hydration for radiant skin',
            price: 120,
            duration: 90,
            category: 'face',
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
          },
          {
            id: 2,
            name: 'Premium Hair Styling',
            description: 'Professional haircut, styling, and treatment',
            price: 85,
            duration: 60,
            category: 'hair',
            image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400'
          },
          {
            id: 3,
            name: 'Relaxing Full Body Massage',
            description: 'Swedish massage to relieve stress and tension',
            price: 150,
            duration: 75,
            category: 'body',
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
          }
        ];

        const grouped = mockServices.reduce((acc, service) => {
          const category = service.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(service);
          return acc;
        }, {} as Record<string, Service[]>);

        setServices(grouped);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categoryIcons: Record<string, React.ReactNode> = {
    hair: <Scissors className="w-6 h-6" />,
    face: <User className="w-6 h-6" />,
    body: <Heart className="w-6 h-6" />,
    nails: <Hand className="w-6 h-6" />,
    makeup: <Palette className="w-6 h-6" />,
    massage: <Sparkles className="w-6 h-6" />,
  };

  const categoryNames: Record<string, string> = {
    hair: 'Hair Services',
    face: 'Facial Treatments',
    body: 'Body Treatments',
    nails: 'Nail Services',
    makeup: 'Makeup Services',
    massage: 'Massage Therapy',
  };

  if (loading) {
    return (
      <section id="services" className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-4">Our Services</h2>
            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
              Loading our premium beauty services...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-800 mb-4">Our Services</h2>
          <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our range of premium beauty treatments designed to enhance your natural beauty and promote wellness
          </p>
        </motion.div>

        <div className="space-y-12 sm:space-y-16">
          {Object.entries(services).map(([category, categoryServices], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6 sm:mb-8">
                <div className="bg-primary-100 text-primary-600 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  {categoryIcons[category]}
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-semibold text-neutral-800">
                  {categoryNames[category]}
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {categoryServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-neutral-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="relative mb-3 sm:mb-4 overflow-hidden rounded-lg sm:rounded-xl">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white px-2 sm:px-3 py-1 rounded-full flex items-center space-x-1">
                        <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current" />
                        <span className="text-xs sm:text-sm font-medium text-neutral-700">4.9</span>
                      </div>
                    </div>

                    <h4 className="text-lg sm:text-xl font-semibold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h4>
                    
                    <p className="text-neutral-600 text-sm mb-3 sm:mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-1 sm:space-x-2 text-neutral-500">
                        <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                        <span className="text-xs sm:text-sm">{service.duration} min</span>
                      </div>
                      <div className="text-lg sm:text-2xl font-bold text-primary-600">
                        {service.price} €
                      </div>
                    </div>

                    <Link 
                      to="/booking"
                      className="w-full bg-primary-600 text-white py-2 sm:py-3 rounded-full font-medium hover:bg-primary-700 transition-colors text-sm sm:text-base text-center block"
                    >
                      Book Now
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;