import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Service } from './Service';
import { Client } from './Client';

export class Appointment extends Model {
  public id!: number;
  public clientId!: number;
  public serviceId!: number;
  public appointmentDate!: Date;
  public appointmentTime!: string;
  public status!: string;
  public notes!: string;
  public totalPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Client,
        key: 'id',
      },
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Service,
        key: 'id',
      },
    },
    appointmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString().split('T')[0],
      },
    },
    appointmentTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        is: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'confirmed', 'completed', 'cancelled']],
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500],
      },
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'appointments',
    indexes: [
      {
        fields: ['clientId'],
      },
      {
        fields: ['serviceId'],
      },
      {
        fields: ['appointmentDate'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

// Define associations
Appointment.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });
Client.hasMany(Appointment, { foreignKey: 'clientId', as: 'appointments' });
Service.hasMany(Appointment, { foreignKey: 'serviceId', as: 'appointments' });