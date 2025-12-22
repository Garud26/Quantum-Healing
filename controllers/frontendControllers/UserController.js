// controllers/frontendControllers/UserController.js

const User = require("../../models/User");
const Appointment = require("../../models/Appointment");
const bcrypt = require("bcryptjs");
const pathModule = require("path"); 
const fs = require("fs");

class UserController {
  
  static loginPage(req, res) {
    res.render("frontend/user-login", {
      title: "User Login / Register",
      path: "/user-login", 
      message: req.flash("message")[0] || null,
      old: req.flash("old")[0] || {},
    });
  }

  // Handle Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email, role: "user" } });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        req.flash("message", "Invalid email or password");
        req.flash("old", req.body);
        return res.redirect("/user-login");
      }

      
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userEmail = user.email;
      req.session.userProfileImg = user.Profile_img;

      req.flash("success", "Login successful! Welcome back.");
      res.redirect("/");
    } catch (err) {
      console.error("User login error:", err);
      req.flash("message", "Something went wrong. Please try again.");
      res.redirect("/user-login");
    }
  }

  // Handle Register
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash("message", "Email already registered. Please login.");
        req.flash("old", req.body);
        return res.redirect("/user-login#register");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: "user",
        Profile_img: "/front-assets/images/default-user.jpg",
      });

     
      req.session.userId = newUser.id;
      req.session.userName = newUser.name;
      req.session.userEmail = newUser.email;
      req.session.userProfileImg = newUser.Profile_img;

      req.flash("success", "Registration successful! Welcome!");
      res.redirect("/dashboard");
    } catch (err) {
      console.error("User registration error:", err);
      req.flash("message", "Registration failed. Please try again.");
      req.flash("old", req.body);
      res.redirect("/user-login#register");
    }
  }

  // User Dashboard
  static async dashboard(req, res) {
    try {
      const user = await User.findByPk(req.session.userId);

      if (!user) {
        req.flash("message", "Session expired. Please login again.");
        return res.redirect("/user-login");
      }

      res.render("frontend/user/dashboard", {
        title: "My Dashboard",
        path: "/dashboard", // Required for header active navigation
        user: {
          name: user.name,
          email: user.email,
          profile_img: user.Profile_img || "/front-assets/images/default-user.jpg"
        },
        message: req.flash("success")[0] || req.flash("error")[0] || null,
        messageType: req.flash("success")[0] ? "success" : "danger"
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      req.flash("error", "Failed to load dashboard");
      res.redirect("/user-login");
    }
  }

  // My Appointments Page
  static async myAppointments(req, res) {
    try {
      const appointments = await Appointment.findAll({
        where: { email: req.session.userEmail },
        order: [["preferred_date", "DESC"], ["preferred_time", "DESC"]]
      });

      res.render("frontend/user/my-appointments", {
        title: "My Appointments",
        path: "/my-appointments", // Required for header active navigation
        appointments,
        user: {
          name: req.session.userName,
          email: req.session.userEmail,
          profile_img: req.session.userProfileImg || "/front-assets/images/default-user.jpg"
        },
        message: req.flash("success")[0] || req.flash("error")[0] || null,
      });
    } catch (err) {
      console.error("My Appointments error:", err);
      req.flash("error", "Failed to load appointments");
      res.redirect("/dashboard");
    }
  }

  // Update Profile Name
  static async updateProfile(req, res) {
    try {
      const { name } = req.body;
      await User.update({ name: name.trim() }, { where: { id: req.session.userId } });

      req.session.userName = name.trim();
      req.flash("success", "Name updated successfully!");
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Update name error:", err);
      req.flash("error", "Failed to update name");
      res.redirect("/dashboard");
    }
  }

  // Update Password
  static async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findByPk(req.session.userId);

      if (!(await bcrypt.compare(currentPassword, user.password))) {
        req.flash("error", "Current password is incorrect");
        return res.redirect("/dashboard");
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await User.update({ password: hashed }, { where: { id: req.session.userId } });

      req.flash("success", "Password changed successfully!");
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Update password error:", err);
      req.flash("error", "Failed to change password");
      res.redirect("/dashboard");
    }
  }

  // Update Profile Image
  static async updateProfileImage(req, res) {
    try {
      if (!req.files || !req.files.profileImage) {
        req.flash("error", "Please select an image");
        return res.redirect("/dashboard");
      }

      const profileImage = req.files.profileImage;
      const uploadDir = pathModule.join(__dirname, "../../public/uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = `profile_${Date.now()}_${Math.round(Math.random() * 1E9)}${pathModule.extname(profileImage.name)}`;
      const uploadPath = pathModule.join(uploadDir, filename);
      await profileImage.mv(uploadPath);

      const imageUrl = `/uploads/${filename}`;

      // Delete old custom image
      const user = await User.findByPk(req.session.userId);
      if (user.Profile_img && !user.Profile_img.includes("default-user.jpg")) {
        const oldPath = pathModule.join(__dirname, "../../public", user.Profile_img);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      await User.update({ Profile_img: imageUrl }, { where: { id: req.session.userId } });
      req.session.userProfileImg = imageUrl;

      req.flash("success", "Profile picture updated successfully!");
      res.redirect("/dashboard");
    } catch (err) {
      console.error("Profile image upload error:", err);
      req.flash("error", "Failed to upload image. Please try again.");
      res.redirect("/dashboard");
    }
  }

  // Logout
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
      }
      res.redirect("/");
    });
  }
}

module.exports = UserController;