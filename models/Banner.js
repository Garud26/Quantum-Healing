// models/Banner.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Banner = sequelize.define("Banner", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order_no: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
  // REMOVED: is_active, createdAt, updatedAt – because they don't exist in your table
}, {
  tableName: "banners",
  timestamps: false,    // This is the key line!
  // Your table has no createdAt/updatedAt and no is_active
});

module.exports = Banner;