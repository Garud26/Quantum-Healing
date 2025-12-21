// models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preferred_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  preferred_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Processing', 'Confirmed', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending' 
  }
}, {
  tableName: 'appointments',
  timestamps: true
});

module.exports = Appointment;