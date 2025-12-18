// models/Rating.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Rating = sequelize.define(
  "Rating",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    message: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING, allowNull: true }, // New field for patient photo
  },
  {
    tableName: "ratings",
    timestamps: true,
  }
);

// Sync table (adds column if missing)
Rating.sync({ alter: true }).catch(() => {});
Rating.sync({ alter: true })
  .then(() => console.log("Rating table synced"))
  .catch((err) => console.error("Sync error:", err));

module.exports = Rating;
