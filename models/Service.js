// models/Service.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Service = sequelize.define(
  "Service",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    icon: DataTypes.STRING,
    image: DataTypes.STRING, // this stores filename like "service1.jpg"
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    order_no: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: "services",
    timestamps: false, // your table has no created_at/updated_at
  }
);

module.exports = Service;
