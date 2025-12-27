import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Newsletter extends Model {
  public id!: number;
  public subject!: string;
  public content!: string;
  public recipients!: number;
  public sentAt!: Date | null;
  public status!: 'draft' | 'sent' | 'scheduled';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Newsletter.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200],
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  recipients: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'scheduled'),
    defaultValue: 'draft',
  },
}, {
  sequelize,
  tableName: 'newsletters',
  timestamps: true,
});

export default Newsletter;