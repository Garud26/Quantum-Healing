const express = require("express");
const router = express.Router();
const MyApis = require("../../controllers/MyApis/ApiController");

// Register Route
router.post("/admin-register", MyApis.registerAdmin);

// Login Route
router.post("/admin-login", MyApis.myLogINAPI);

// Logout Route
router.get("/admin-logout", MyApis.myfirstAPI);

module.exports = router;