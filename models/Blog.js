// models/Blog.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Blog = sequelize.define("Blog", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  author: DataTypes.STRING,
  image: DataTypes.STRING,
  tags: DataTypes.STRING,
}, {
  tableName: "Blogs",                // change to "blogs" if your table is lowercase
  timestamps: false,
});

module.exports = Blog;