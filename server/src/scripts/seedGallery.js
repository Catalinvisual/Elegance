const { sequelize } = require('../../dist/config/database');
const { Gallery } = require('../../dist/models/Gallery');

const realGalleryImages = [
  // Services images
  {
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    title: 'Luxury Facial Treatment',
    description: 'Professional facial treatment in a relaxing environment',
    category: 'services',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800',
    title: 'Hair Styling Station',
    description: 'Modern hair styling station with professional equipment',
    category: 'services',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    title: 'Massage Therapy Room',
    description: 'Relaxing massage therapy room with ambient lighting',
    category: 'services',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    title: 'Nail Care Station',
    description: 'Professional nail care station with modern equipment',
    category: 'services',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    title: 'Makeup Application',
    description: 'Professional makeup application with premium products',
    category: 'services',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1605496036006-fa36378ca4ab?w=800',
    title: 'Hair Color Treatment',
    description: 'Professional hair coloring and treatment services',
    category: 'services',
    isActive: true
  },
  
  // Interior images
  {
    url: 'https://images.unsplash.com/photo-1596178065887-1198b8b79843?w=800',
    title: 'Spa Reception Area',
    description: 'Welcoming reception area with modern design',
    category: 'interior',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1540487486910-8b5b0d5c0b6d?w=800',
    title: 'Relaxation Lounge',
    description: 'Comfortable relaxation lounge for clients',
    category: 'interior',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    title: 'Treatment Room',
    description: 'Private treatment room with calming ambiance',
    category: 'interior',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800',
    title: 'Modern Salon Interior',
    description: 'Contemporary salon interior with elegant design',
    category: 'interior',
    isActive: true
  },
  
  // Products images
  {
    url: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800',
    title: 'Professional Hair Products',
    description: 'High-quality professional hair care products',
    category: 'products',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800',
    title: 'Skincare Products',
    description: 'Premium skincare products used in our treatments',
    category: 'products',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    title: 'Nail Care Products',
    description: 'Professional nail care and treatment products',
    category: 'products',
    isActive: true
  },
  
  // Team images
  {
    url: 'https://images.unsplash.com/photo-1594824804732-5f7a0e12e9a9?w=800',
    title: 'Senior Stylist',
    description: 'Our experienced senior hair stylist at work',
    category: 'team',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1556760544-74068565f05c?w=800',
    title: 'Beauty Therapist',
    description: 'Professional beauty therapist providing treatment',
    category: 'team',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    title: 'Nail Technician',
    description: 'Skilled nail technician working with client',
    category: 'team',
    isActive: true
  },
  
  // Results images
  {
    url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
    title: 'Hair Transformation',
    description: 'Beautiful hair transformation result',
    category: 'results',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    title: 'Facial Results',
    description: 'Amazing facial treatment results',
    category: 'results',
    isActive: true
  },
  {
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    title: 'Nail Art Results',
    description: 'Beautiful nail art and design results',
    category: 'results',
    isActive: true
  }
];

async function seedGallery() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Sync the Gallery model
    await Gallery.sync();
    
    // Clear existing gallery images
    await Gallery.destroy({ where: {}, truncate: true });
    console.log('Cleared existing gallery images.');
    
    // Insert new gallery images
    for (const image of realGalleryImages) {
      await Gallery.create(image);
      console.log(`Added gallery image: ${image.title}`);
    }
    
    console.log('Gallery seeding completed successfully!');
    console.log(`Total gallery images added: ${realGalleryImages.length}`);
    
    // Display summary by category
    const categories = {};
    realGalleryImages.forEach(image => {
      if (!categories[image.category]) {
        categories[image.category] = 0;
      }
      categories[image.category]++;
    });
    
    console.log('\nGallery images by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`${category}: ${count} images`);
    });
    
  } catch (error) {
    console.error('Error seeding gallery:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeding
seedGallery();