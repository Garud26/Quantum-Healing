// models/HomePageSetting.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HomePageSetting = sequelize.define('HomePageSetting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  section: {
    type: DataTypes.ENUM('patient-treated', 'feature', 'chiropractor', 'special-offer'),
    allowNull: false,
    unique: true,
  },
  mediaType: {
    type: DataTypes.ENUM('image', 'video'),
    allowNull: false,
    defaultValue: 'image',
  },
  // For images: uploaded file path, for videos: YouTube/Vimeo embed URL
  mediaUrl: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    defaultValue: '',
  },
  content: {
    type: DataTypes.TEXT('long'),
    allowNull: false,
    defaultValue: '<p>Enter content here...</p>',
  },
}, {
  tableName: 'home_page_settings',
  timestamps: true,
});

module.exports = HomePageSetting;