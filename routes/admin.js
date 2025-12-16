// routes/admin.js

const express = require("express");
const router = express.Router();

// ====================== CONTROLLERS ======================
const adminController           = require("../controllers/adminController");
const blogController            = require("../controllers/blogController");
const bannerController          = require("../controllers/bannerController");
const serviceController         = require("../controllers/serviceController");
const settingsController        = require("../controllers/settingsController");
const ratingController          = require("../controllers/ratingController");
const homepageSettingController = require("../controllers/homepageSettingController");
const aboutUsSettingController  = require("../controllers/aboutUsSettingController");  
const contactSettingsCtrl       = require("../controllers/contactSettingsController");
const contactFormCtrl           = require("../controllers/contactFormController");
const contactFormAdminController = require('../controllers/admin/contactFormAdminController');
const appointmentAdminController = require('../controllers/admin/appointmentAdminController');
const imagesLogoController = require("../controllers/imagesLogoController");

// ====================== MIDDLEWARE ======================
const auth   = require("../middleware/auth");
const upload = require("../middleware/upload");

// ==================== PUBLIC LOGIN ROUTES ====================
router.get("/login", adminController.loginPage);
router.post("/loginsubmit", adminController.login);

// ==================== PROTECTED ROUTES (Require Login) ====================
router.use(auth); // ← All routes below this line require authentication

// Dashboard & Profile
router.get("/dashboard", adminController.dashboard);
router.get("/admin-profile", adminController.admin_profile);
router.post("/update", upload.single("profile_image"), adminController.register);

// Site Settings
router.get("/site-settings", settingsController.index);
router.post("/site-settings", upload.single("site_logo"), settingsController.update);

// ==================== BLOG ROUTES ====================
router.get("/blogs", blogController.list);
router.get("/blogs/add", blogController.addPage);
router.post("/blogs/add", upload.single("image"), blogController.add);

router.get("/blogs/edit/:id", blogController.editPage)
  .post("/blogs/:id", upload.single("image"), blogController.update)
  .put("/blogs/:id", upload.single("image"), blogController.update);

router.delete("/blogs/:id", blogController.deleteBlog);

// ==================== BANNER ROUTES ====================
router.get("/banners", bannerController.list);
router.get("/banners/add", bannerController.addPage);
router.post("/banners/add", upload.single("image"), bannerController.create);

router.get("/banners/edit/:id", bannerController.editPage);
router.post("/banners/edit/:id", upload.single("image"), bannerController.update);
router.put("/banners/:id", upload.single("image"), bannerController.update);

router.get("/banners/delete/:id", bannerController.delete);
router.delete("/banners/:id", bannerController.delete);

router.get("/banner", (req, res) => res.redirect("/admin/banners"));

// ==================== SERVICE ROUTES ====================
router.get("/services", serviceController.list);
router.get("/services/add", serviceController.addPage);
router.post("/services/add", upload.single("image"), serviceController.create);

router.get("/services/edit/:id", serviceController.editPage);
router.post("/services/edit/:id", upload.single("image"), serviceController.update);
router.put("/services/:id", upload.single("image"), serviceController.update);

router.get("/services/delete/:id", serviceController.delete);
router.delete("/services/:id", serviceController.delete);

// ==================== RATINGS ROUTES ====================
router.get("/ratings", ratingController.list);
router.get("/ratings/add", ratingController.addPage);
router.post("/ratings/add", ratingController.add);

router.get("/ratings/edit/:id", ratingController.editPage);
router.post("/ratings/edit/:id", ratingController.update);

router.get("/ratings/delete/:id", ratingController.delete);
router.delete("/ratings/:id", ratingController.delete);

// ==================== HOMEPAGE SETTINGS ROUTES ====================
router.get("/homepage-settings", homepageSettingController.index);
router.post(
  "/homepage-settings",
  upload.array("media", 2),
  homepageSettingController.update
);

// ==================== ABOUT US SETTINGS ROUTES ====================
router.get("/about-us-settings", aboutUsSettingController.index);
router.post(
  "/about-us-settings",
  upload.fields([
    { name: 'about_me_image', maxCount: 1 },
    { name: 'who_we_are_image', maxCount: 1 },
    { name: 'we_offer_image', maxCount: 1 }
  ]),
  aboutUsSettingController.update
);

// ==================== CONTACT SETTINGS ROUTES ====================
router.get('/contact-settings', contactSettingsCtrl.index);

router.post('/contact-settings',
  upload.fields([
    { name: 'location_image', maxCount: 1 },
    { name: 'phone_image', maxCount: 1 },
    { name: 'email_image', maxCount: 1 }
  ]),
  contactSettingsCtrl.update
);

router.get('/contact-forms', contactSettingsCtrl.listForms);
router.get('/contact-forms',  contactFormAdminController.list);

// ==================== APPOINTMENT REQUESTS ====================
router.get('/appointments', appointmentAdminController.list);
router.post('/appointments/edit/:id', appointmentAdminController.update);
router.get('/appointments/delete/:id', appointmentAdminController.delete);

// ==================== IMAGES & LOGO SETTINGS ROUTES ====================

router.get("/images-logo", imagesLogoController.index);

router.post(
  "/images-logo",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "gallery_images", maxCount: 6 }, 
  ]),
  imagesLogoController.update
);

// ==================== LOGOUT ====================
router.get("/logout", adminController.logout);

module.exports = router;