const { sequelize } = require('../../dist/config/database');
const { Service } = require('../../dist/models/Service');

const realServices = [
  // Hair Services
  {
    name: 'Classic Haircut & Styling',
    description: 'Professional haircut with blow-dry and styling. Includes consultation to find the perfect style for your face shape and lifestyle.',
    price: 65,
    duration: 60,
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=400',
    isActive: true
  },
  {
    name: 'Premium Hair Coloring',
    description: 'Full hair color treatment using high-quality products. Includes root touch-up, full coverage, or color refresh.',
    price: 120,
    duration: 120,
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?w=400',
    isActive: true
  },
  {
    name: 'Balayage & Highlights',
    description: 'Natural-looking highlights and balayage techniques. Hand-painted for a sun-kissed, dimensional look.',
    price: 180,
    duration: 180,
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400',
    isActive: true
  },
  {
    name: 'Hair Treatment & Repair',
    description: 'Deep conditioning treatment to repair damaged hair. Includes scalp massage and nourishing mask.',
    price: 85,
    duration: 45,
    category: 'hair',
    image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400',
    isActive: true
  },
  
  // Facial Treatments
  {
    name: 'Classic European Facial',
    description: 'Deep cleansing facial with extraction, massage, and mask. Customized for your skin type and concerns.',
    price: 95,
    duration: 75,
    category: 'face',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400',
    isActive: true
  },
  {
    name: 'Anti-Aging Treatment',
    description: 'Advanced facial treatment targeting fine lines and wrinkles. Includes collagen-boosting serums and lifting massage.',
    price: 150,
    duration: 90,
    category: 'face',
    image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=400',
    isActive: true
  },
  {
    name: 'Hydrating Facial',
    description: 'Intensive moisturizing treatment for dry and dehydrated skin. Leaves skin plump, radiant, and refreshed.',
    price: 110,
    duration: 60,
    category: 'face',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    isActive: true
  },
  {
    name: 'Acne Treatment Facial',
    description: 'Specialized treatment for acne-prone skin. Deep cleansing with antibacterial products and calming mask.',
    price: 125,
    duration: 75,
    category: 'face',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    isActive: true
  },
  
  // Body Treatments
  {
    name: 'Swedish Relaxation Massage',
    description: 'Full body Swedish massage to relieve stress and tension. Gentle, flowing techniques promote deep relaxation.',
    price: 120,
    duration: 75,
    category: 'body',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    isActive: true
  },
  {
    name: 'Deep Tissue Massage',
    description: 'Therapeutic massage targeting deep muscle layers. Ideal for chronic pain and muscle tension relief.',
    price: 140,
    duration: 90,
    category: 'body',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b8b79843?w=400',
    isActive: true
  },
  {
    name: 'Body Scrub & Wrap',
    description: 'Exfoliating body scrub followed by hydrating wrap. Leaves skin smooth, soft, and deeply moisturized.',
    price: 110,
    duration: 60,
    category: 'body',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    isActive: true
  },
  {
    name: 'Hot Stone Therapy',
    description: 'Relaxing massage with heated stones. Warmth penetrates deep into muscles for ultimate relaxation.',
    price: 160,
    duration: 90,
    category: 'body',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400',
    isActive: true
  },
  
  // Nail Services
  {
    name: 'Classic Manicure',
    description: 'Basic nail care including shaping, cuticle care, and polish application. Perfect for everyday elegance.',
    price: 35,
    duration: 45,
    category: 'nails',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400',
    isActive: true
  },
  {
    name: 'Gel Manicure',
    description: 'Long-lasting gel polish manicure. Chip-resistant and glossy finish that lasts 2-3 weeks.',
    price: 55,
    duration: 60,
    category: 'nails',
    image: 'https://images.unsplash.com/photo-1616587894289-86480e533129?w=400',
    isActive: true
  },
  {
    name: 'Luxury Spa Pedicure',
    description: 'Complete foot care with exfoliation, massage, and polish. Includes foot soak and moisturizing treatment.',
    price: 65,
    duration: 75,
    category: 'nails',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    isActive: true
  },
  {
    name: 'Nail Art & Design',
    description: 'Creative nail art with various designs and techniques. Custom designs to match your style.',
    price: 75,
    duration: 90,
    category: 'nails',
    image: 'https://images.unsplash.com/photo-1616587894289-86480e533129?w=400',
    isActive: true
  },
  
  // Makeup Services
  {
    name: 'Natural Day Makeup',
    description: 'Fresh, natural makeup perfect for daytime events. Enhances your features while maintaining a subtle look.',
    price: 65,
    duration: 45,
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    isActive: true
  },
  {
    name: 'Evening Glamour Makeup',
    description: 'Dramatic evening makeup with smoky eyes and bold lips. Perfect for special occasions and events.',
    price: 95,
    duration: 75,
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    isActive: true
  },
  {
    name: 'Bridal Makeup Trial',
    description: 'Trial session for bridal makeup. We work together to create your perfect wedding day look.',
    price: 120,
    duration: 90,
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    isActive: true
  },
  {
    name: 'Makeup Lesson',
    description: 'One-on-one makeup lesson teaching techniques and product application. Personalized to your needs.',
    price: 85,
    duration: 90,
    category: 'makeup',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    isActive: true
  }
];

async function seedServices() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync the Service model
    await Service.sync();
    
    // Clear existing services
    await Service.destroy({ where: {}, truncate: true });
    console.log('Cleared existing services.');
    
    // Insert new services
    for (const service of realServices) {
      await Service.create(service);
      console.log(`Added service: ${service.name}`);
    }
    
    console.log('Services seeding completed successfully!');
    console.log(`Total services added: ${realServices.length}`);
    
    // Display summary by category
    const categories = {};
    realServices.forEach(service => {
      if (!categories[service.category]) {
        categories[service.category] = 0;
      }
      categories[service.category]++;
    });
    
    console.log('\nServices by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`${category}: ${count} services`);
    });
    
  } catch (error) {
    console.error('Error seeding services:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeding
seedServices();