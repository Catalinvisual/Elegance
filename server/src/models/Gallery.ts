import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Gallery extends Model {
  public id!: number;
  public url!: string;
  public title!: string;
  public description!: string;
  public category!: 'services' | 'interior' | 'products' | 'team' | 'results';
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Gallery.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500],
    },
  },
  category: {
    type: DataTypes.ENUM('services', 'interior', 'products', 'team', 'results'),
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  sequelize,
  tableName: 'galleries',
  timestamps: true,
});

export default Gallery;