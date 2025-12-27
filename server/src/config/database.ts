import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Debug logging for database connection
console.log('Database Configuration Check:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- DATABASE_URL provided: ${!!process.env.DATABASE_URL}`);
console.log(`- DB_HOST: ${process.env.DB_HOST}`);
console.log(`- DB_NAME: ${process.env.DB_NAME}`);

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  console.log('Using DATABASE_URL connection strategy');
  // Railway provides DATABASE_URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  console.log('Using Individual Variables connection strategy');
  // Fallback to individual variables or SQLite for dev
  const options: Options = {
    database: process.env.DB_NAME || 'beauty_salon',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: isProduction ? 'postgres' : 'sqlite',
    storage: !isProduction ? './database.sqlite' : undefined,
    logging: !isProduction ? console.log : false,
    dialectOptions: isProduction ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : undefined,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  sequelize = new Sequelize(options);
}

export { sequelize };