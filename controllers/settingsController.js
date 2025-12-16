// controllers/settingsController.js

const Settings = require("../models/Settings");

module.exports = {
  // GET - Show Site Settings Page
  index: async (req, res) => {
    try {
      let settings = await Settings.findByPk(1);
      if (!settings) {
        settings = await Settings.create({ site_name: "My Awesome CMS" });
      }

      res.render("admin/site-settings", {
        title: "Site Settings",
        user: req.session.user,
        settings: settings.get({ plain: true }),
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Server Error");
      res.redirect("/admin/dashboard");
    }
  },

  // POST - Save Site Settings
  update: async (req, res) => {
    try {
      const {
        site_name,
      header_footer,
      site_email,
      site_address,
      contact_no,
      site_insta_url,
      site_fb_url,
      site_linkedin_url,
      site_x_url,
      footer_copyright_text,
    } = req.body;

      const updateData = {
        site_name,
        header_footer,
        site_email,
        site_address,
        contact_no,
        site_insta_url,
        site_fb_url,
        site_linkedin_url,
        site_x_url,
        footer_copyright_text,
      };

      if (req.file) {
        updateData.site_logo = req.file.filename;
      }

      await Settings.upsert({ id: 1, ...updateData });

      req.flash("success", "Site settings saved successfully!");
      res.redirect("/admin/site-settings");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to save settings");
      res.redirect("/admin/site-settings");
    }
  },
};











async function SettingsOne() {
  let settings = await Settings.findByPk(1);
  if (!settings) {
    settings = await Settings.create({ site_name: "My CMS" });
  }
  return settings.get({ plain: true });
}

module.exports.SettingsOne = SettingsOne;