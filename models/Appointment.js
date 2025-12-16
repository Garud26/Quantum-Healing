// models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  preferred_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  preferred_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = Appointment;