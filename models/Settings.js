
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Settings = sequelize.define(
  "Settings",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    site_name: { type: DataTypes.STRING, allowNull: false, defaultValue: "My CMS" },
    site_logo: { type: DataTypes.STRING },
    header_footer: { type: DataTypes.STRING },
    site_email: { type: DataTypes.STRING },
    site_address: { type: DataTypes.TEXT },
    contact_no: { type: DataTypes.STRING },
    site_insta_url: { type: DataTypes.STRING },
    site_fb_url: { type: DataTypes.STRING },
    site_linkedin_url: { type: DataTypes.STRING },
    site_x_url: { type: DataTypes.STRING },
    footer_copyright_text: { type: DataTypes.TEXT },
  },
  {
    tableName: "settings",
    timestamps: true,
  }
);

// Create table + default row if not exists
Settings.sync({ force: false }).then(async () => {
  const count = await Settings.count();
  if (count === 0) {
    await Settings.create({ site_name: "My Awesome CMS" });
    console.log("Default settings created");
  }
});

module.exports = Settings;