// controllers/serviceController.js
const Service = require("../models/Service");

module.exports = {
  // List all services
  list: async (req, res) => {
    try {
      const services = await Service.findAll({
        order: [["order_no", "ASC"], ["id", "DESC"]],
      });

      res.render("admin/services/list", {
        title: "Services",
        user: req.session.user,
        services,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    } catch (err) {
      console.error(err);
      req.flash("error", "Server Error");
      res.redirect("/admin/dashboard");
    }
  },

  // Add new service (form)
  addPage: (req, res) => {
    res.render("admin/services/add", {
      title: "Add Service",
      user: req.session.user,
    });
  },

  // Create new service
  create: async (req, res) => {
    try {
      const { title, description, icon, order_no } = req.body;

      await Service.create({
        title,
        description,
        icon: icon || null,
        image: req.file ? req.file.filename : null,
        order_no: order_no || 0,
      });

      req.flash("success", "Service added successfully");
      res.redirect("/admin/services");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to add service");
      res.redirect("/admin/services/add");
    }
  },

  // Edit service
  editPage: async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        req.flash("error", "Service not found");
        return res.redirect("/admin/services");
      }

      res.render("admin/services/edit", {
        title: "Edit Service",
        user: req.session.user,
        service,
      });
    } catch (err) {
      req.flash("error", "Server Error");
      res.redirect("/admin/services");
    }
  },

  // Update service
  update: async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (!service) {
        req.flash("error", "Service not found");
        return res.redirect("/admin/services");
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        icon: req.body.icon || null,
        order_no: req.body.order_no || 0,
      };

      if (req.file) {
        updateData.image = req.file.filename;
      }

      await service.update(updateData);
      req.flash("success", "Service updated successfully");
      res.redirect("/admin/services");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to update service");
      res.redirect("/admin/services");
    }
  },

  // Delete service
  delete: async (req, res) => {
    try {
      const service = await Service.findByPk(req.params.id);
      if (service) await service.destroy();
      req.flash("success", "Service deleted");
      res.redirect("/admin/services");
    } catch (err) {
      req.flash("error", "Failed to delete");
      res.redirect("/admin/services");
    }
  },
};