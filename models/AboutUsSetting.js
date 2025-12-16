// models/AboutUsSetting.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AboutUsSetting = sequelize.define('AboutUsSetting', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  about_me_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  about_me_content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  who_we_are_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  who_we_are_content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  video_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  we_offer_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  we_offer_content: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'about_us_settings',
  timestamps: true,
  paranoid: true
});

// Ensure only one record exists (optional, but recommended for settings)
AboutUsSetting.findOrCreateDefault = async function() {
  let setting = await this.findOne();
  if (!setting) {
    setting = await this.create({});
  }
  return setting;
};

module.exports = AboutUsSetting;