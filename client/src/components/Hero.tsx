import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Users } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-28">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-rose-50 to-neutral-100"></div>
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-primary-200 rounded-full filter blur-3xl opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-rose-200 rounded-full filter blur-3xl opacity-30"
        animate={{
          scale: [1.2, 1, 1.2],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-neutral-800 mb-4 leading-tight">
                Discover Your
                <span className="text-primary-600"> Natural</span>
                <br className="hidden sm:block" />
                Beauty
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-neutral-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Experience luxury beauty treatments in a serene, modern environment. 
                Our expert team is dedicated to enhancing your natural beauty and wellness.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/booking"
                className="bg-primary-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-primary-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                <Calendar className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Book Appointment</span>
              </Link>
              <a
                href="#services"
                className="border-2 border-primary-600 text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
              >
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" />
                <span>Our Services</span>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-neutral-200"
            >
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-primary-600">500+</div>
                <div className="text-xs sm:text-sm text-neutral-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-primary-600">50+</div>
                <div className="text-xs sm:text-sm text-neutral-600">Beauty Services</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-primary-600">5+</div>
                <div className="text-xs sm:text-sm text-neutral-600">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Beauty Salon Interior"
                className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl sm:rounded-3xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmNmMmY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2RiMjc3NyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJlYXV0eSBTYWxvbjwvdGV4dD48L3N2Zz4=';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Users className="w-8 h-8 text-primary-600" />
            </motion.div>
            
            <motion.div
              className="absolute -bottom-4 -left-4 bg-primary-600 text-white p-4 rounded-2xl shadow-lg"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;