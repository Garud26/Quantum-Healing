const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ImagesLogo = sequelize.define("ImagesLogo", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  gallery_images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    // ADD THIS GETTER TO ALWAYS RETURN ARRAY
    get() {
      const rawValue = this.getDataValue('gallery_images');
      if (rawValue === null || rawValue === undefined) {
        return [];
      }
      if (typeof rawValue === 'string') {
        try {
          return JSON.parse(rawValue);
        } catch {
          return [];
        }
      }
      return Array.isArray(rawValue) ? rawValue : [];
    },
    // Optional: setter to ensure it's saved correctly
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('gallery_images', value);
      } else {
        this.setDataValue('gallery_images', []);
      }
    }
  },
}, {
  tableName: "images_logos",
  timestamps: true,
});

module.exports = ImagesLogo;