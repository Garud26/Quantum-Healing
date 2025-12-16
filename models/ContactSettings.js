// models/ContactSettings.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ContactSettings = sequelize.define('ContactSettings', {
  location_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  phone_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  map_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = ContactSettings;