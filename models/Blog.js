// models/Blog.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Blog = sequelize.define("Blog", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  author: DataTypes.STRING,
  image: DataTypes.STRING,
  tags: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('tags');
      if (!rawValue) return [];
      try {
        return JSON.parse(rawValue);
      } catch (e) {
        // Fallback: if it's comma-separated string (legacy data)
        return rawValue.split(',').map(t => t.trim()).filter(t => t);
      }
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('tags', JSON.stringify(value));
      } else if (typeof value === 'string') {
        this.setDataValue('tags', JSON.stringify(value.split(',').map(t => t.trim()).filter(t => t)));
      } else {
        this.setDataValue('tags', JSON.stringify([]));
      }
    }
  },
}, {
  tableName: "Blogs",
  timestamps: false,
});

module.exports = Blog;