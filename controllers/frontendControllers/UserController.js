// controllers/frontendControllers/UserController.js

const User = require("../../models/User");
const bcrypt = require("bcryptjs");

class UserController {
  // Show Login/Register Page
  static loginPage(req, res) {
    res.render("frontend/user-login", {
      title: "User Login / Register",
      path: "/user-login",
      message: req.flash("message") || null,
      old: req.flash("old") || {},
    });
  }

  // Handle Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      let role = 'user';
      const user = await User.findOne({ where: { email, role} });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        req.flash("message", "Invalid email or password");
        req.flash("old", req.body);
        return res.redirect("/user-login");
      }

      // Save user session
      req.session.userId = user.id;
      req.session.userName = user.name;
      req.session.userEmail = user.email;
      req.session.userRole = user.role;

      req.flash("success", "Login successful!");
      res.redirect("/");
    } catch (err) {
      console.error("User login error:", err);
      req.flash("message", "Something went wrong. Try again.");
      res.redirect("/user-login");
    }
  }

  // Handle Register
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        req.flash("message", "Email already registered. Please login.");
        req.flash("old", req.body);
        return res.redirect("/user-login#register");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: "user", // default role
        Profile_img: "/front-assets/images/default-user.jpg", // default profile image
      });

      req.flash("message", "Registration successful! Please login.");
      res.redirect("/user-login");
    } catch (err) {
      console.error("User registration error:", err);
      req.flash("message", "Registration failed. Try again.");
      req.flash("old", req.body);
      res.redirect("/user-login#register");
    }
  }

  // Logout
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
      res.redirect("/");
    });
  }
}

module.exports = UserController;