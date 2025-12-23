const bcrypt = require("bcrypt");
const Admin = require("../../models/Admin");

module.exports = {
  // ==================== REGISTER ADMIN ====================
  registerAdmin: async (req, res) => {
    try {
      const { name, email, password, role, Profile_img } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Validation Error: name, email, and password are required.",
        });
      }
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res
          .status(400)
          .json({ success: false, message: "Email already registered." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await Admin.create({
        name,
        email,
        password: hashedPassword,
        role: role || "admin",
        Profile_img: Profile_img || "default-avatar.png",
      });
      res.status(201).json({
        success: true,
        message: "Admin Registered Successfully",
        data: { id: newAdmin.id, email: newAdmin.email },
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ==================== LOGIN ADMIN ====================

  myLogINAPI: async (req, res) => {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin not found." });
      }
      let dbPassword = admin.password;
      if (dbPassword.startsWith("$2y$")) {
        dbPassword = dbPassword.replace("$2y$", "$2a$");
      }
      const isMatch = await bcrypt.compare(password, dbPassword);
      if (isMatch) {
        req.session.admin = {
          id: admin.id,
          name: admin.name,
          role: admin.role,
        };
        return res.json({
          success: true,
          message: "Admin Login Successfully",
          admin: { name: admin.name, email: admin.email },
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials." });
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  },

  // ==================== LOGOUT ADMIN ====================
  myfirstAPI: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("LOGOUT ERROR:", err);
        return res
          .status(500)
          .json({ success: false, message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Admin Logout Successfully",
      });
    });
  },
};
