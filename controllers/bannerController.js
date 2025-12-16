// controllers/bannerController.js
const Banner = require("../models/Banner");

module.exports = {
  // List all banners
  list: async (req, res) => {
    try {
      const banners = await Banner.findAll({
        order: [["order_no", "ASC"], ["id", "DESC"]],
      });

      res.render("admin/banners/list", {
        title: "Banners",
        user: req.session.user,
        banners,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Server Error");
      res.redirect("/admin/dashboard");
    }
  },

  // Add form
  addPage: (req, res) => {
    res.render("admin/banners/add", {
      title: "Add Banner",
      user: req.session.user,
    });
  },

  // Create
  create: async (req, res) => {
    try {
      const { title, subtitle, order_no } = req.body;

      await Banner.create({
        title,
        subtitle: subtitle || null,
        image: req.file ? req.file.filename : null,
        order_no: order_no || 0,
      });

      req.flash("success", "Banner added successfully");
      res.redirect("/admin/banners");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to add banner");
      res.redirect("/admin/banners/add");
    }
  },

  // Edit form
  editPage: async (req, res) => {
    try {
      const banner = await Banner.findByPk(req.params.id);
      if (!banner) {
        req.flash("error", "Banner not found");
        return res.redirect("/admin/banners");
      }

      res.render("admin/banners/edit", {
        title: "Edit Banner",
        user: req.session.user,
        banner,
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Server Error");
      res.redirect("/admin/banners");
    }
  },

  // Update
  update: async (req, res) => {
    try {
      const banner = await Banner.findByPk(req.params.id);
      if (!banner) {
        req.flash("error", "Banner not found");
        return res.redirect("/admin/banners");
      }

      const updateData = {
        title: req.body.title,
        subtitle: req.body.subtitle || null,
        order_no: req.body.order_no || 0,
      };

      if (req.file) {
        updateData.image = req.file.filename;
      }

      await banner.update(updateData);
      req.flash("success", "Banner updated successfully");
      res.redirect("/admin/banners");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to update banner");
      res.redirect("/admin/banners");
    }
  },

  // Delete
  delete: async (req, res) => {
    try {
      const banner = await Banner.findByPk(req.params.id);
      if (banner) await banner.destroy();
      req.flash("success", "Banner deleted");
      res.redirect("/admin/banners");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to delete");
      res.redirect("/admin/banners");
    }
  },
};