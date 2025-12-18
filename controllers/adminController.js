// controllers/adminController.js

const Admin = require("../models/Admin");  // ← Correct import of Admin model
const bcrypt = require("bcrypt");

module.exports = {
  // Render Login Page
  loginPage: (req, res) => {
    res.render("admin/login", {
      message: req.flash("error"),
    });
  },

  // Handle Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ where: { email } });

      if (!admin) {
        req.flash("error", "Invalid Email or Password");
        return res.redirect("/admin/login");
      }

      let hashedPassword = admin.password;
      // Fix for passwords hashed with older bcrypt versions ($2y$ → $2a$)
      if (hashedPassword.startsWith("$2y$")) {
        hashedPassword = hashedPassword.replace("$2y$", "$2a$");
      }

      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        req.flash("error", "Invalid Email or Password");
        return res.redirect("/admin/login");
      }

      // Store admin data in session
      req.session.user = admin.get({ plain: true });
      req.flash("success", "Welcome back!");
      res.redirect("/admin/dashboard");
    } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong");
      res.redirect("/admin/login");
    }
  },

  // Dashboard
  dashboard: (req, res) => {
    res.render("admin/index");
  },

  // Admin Profile Page
  admin_profile: (req, res) => {
    const user = req.session.user || null;
    res.render("admin/admin-profile", {
      user,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  },

  // Update Profile (called "register" in your route, but it's actually update)
  register: async (req, res) => {
    try {
      if (!req.session.user) {
        req.flash("error", "Please login again");
        return res.redirect("/admin/login");
      }

      const adminId = req.session.user.id;

      const { name, email, password, confirm_password } = req.body;

      const updateData = {
        name: name?.trim(),
        email: email?.trim(),
      };

      if (password) {
        if (password !== confirm_password) {
          req.flash("error", "Passwords do not match");
          return res.redirect("/admin/admin-profile");
        }
        updateData.password = await bcrypt.hash(password, 10);
      }

      if (req.file) {
        updateData.Profile_img = req.file.filename;
      }

      // Update in Admins table
      await Admin.update(updateData, { where: { id: adminId } });

      // Refresh session with updated data
      const updatedAdmin = await Admin.findByPk(adminId);
      req.session.user = updatedAdmin.get({ plain: true });

      req.flash("success", "Profile updated successfully!");
      res.redirect("/admin/admin-profile");
    } catch (err) {
      console.error("Profile Update Error:", err);
      req.flash("error", "Failed to update profile");
      res.redirect("/admin/admin-profile");
    }
  },

  // Logout
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) console.log(err);
      res.redirect("/admin/login");
    });
  },
};