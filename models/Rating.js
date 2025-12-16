// models/Rating.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  rating: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  message: { type: DataTypes.TEXT }
}, {
  tableName: 'ratings',
  timestamps: true
});

// Auto create/update table (no migration needed)
Rating.sync({ alter: true }).catch(() => {});

module.exports = Rating;