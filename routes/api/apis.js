const express = require("express");
const router = express.Router();
const MyApis = require('../../controllers/MyApis/ApiController');

// Test API

router.get("/test-admin-logout", MyApis.myfirstAPI);


module.exports = router;