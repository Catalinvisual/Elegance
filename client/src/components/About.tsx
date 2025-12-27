import React from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Users, Sparkles, Star } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8 text-primary-600" />,
      title: 'Certified Professionals',
      description: 'Our team consists of highly trained and certified beauty experts'
    },
    {
      icon: <Heart className="w-8 h-8 text-primary-600" />,
      title: 'Premium Products',
      description: 'We use only the highest quality, cruelty-free beauty products'
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: 'Personalized Care',
      description: 'Every treatment is tailored to your unique needs and preferences'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary-600" />,
      title: 'Modern Techniques',
      description: 'Staying current with the latest beauty trends and innovations'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Regular Client',
      content: 'The best beauty salon experience I\'ve ever had. Professional, clean, and incredibly relaxing!',
      rating: 5
    },
    {
      name: 'Emma Davis',
      role: 'New Client',
      content: 'Amazing service! The staff is so friendly and skilled. I left feeling beautiful and confident.',
      rating: 5
    },
    {
      name: 'Lisa Chen',
      role: 'VIP Client',
      content: 'I\'ve been coming here for years. The quality and attention to detail is unmatched.',
      rating: 5
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-neutral-50 to-rose-50">
      <div className="container mx-auto px-4">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="text-4xl font-display font-bold text-neutral-800 mb-6">
              About Elegance Beauty Salon
            </h2>
            <p className="text-lg text-neutral-600 mb-6">
              Welcome to Elegance, where beauty meets wellness. Our modern salon is dedicated to providing 
              you with exceptional beauty services in a relaxing and luxurious environment.
            </p>
            <p className="text-neutral-600 mb-8">
              With over 5 years of experience, our certified professionals are passionate about helping 
              you look and feel your best. We believe in using premium, cruelty-free products and 
              staying current with the latest beauty trends and techniques.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-primary-100 p-2 rounded-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-neutral-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Beauty Salon Interior"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">500+</div>
                <div className="text-sm text-neutral-600">Satisfied Clients</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-display font-bold text-neutral-800 mb-4">What Our Clients Say</h3>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued clients have to say about their experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-neutral-600 mb-4 italic">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800">{testimonial.name}</h4>
                  <p className="text-sm text-neutral-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;