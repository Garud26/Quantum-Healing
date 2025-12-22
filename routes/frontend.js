
const express = require("express");
const router = express.Router();

const FrontController = require("../controllers/frontendControllers/frontController");
const contactFormController = require("../controllers/contactFormController");
const appointmentController = require("../controllers/appointmentController");
const UserController = require("../controllers/frontendControllers/UserController");
const authUser = require("../middleware/authUser");

const { body, validationResult } = require("express-validator");


router.use(FrontController.loadImagesLogo); 

router.get("/", FrontController.home);
router.get("/about-us", FrontController.aboutUs);
router.get("/services", FrontController.services);
router.get("/blog", FrontController.blog);
router.get("/blog/:id", FrontController.blogDetail);
router.get("/contact", FrontController.contact);
router.get("/appointment", FrontController.appointment);

// contact form
router.post(
  "/contact",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("subject").trim().notEmpty().withMessage("Subject is required"),
    body("message").trim().notEmpty().withMessage("Message is required"),
  ],
  contactFormController.submit
);

// Appointment form submission
router.post(
  "/appointment",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().withMessage("Valid email is required"),
    body("phone").trim().notEmpty().withMessage("Phone is required"),
    body("service").trim().notEmpty().withMessage("Service is required"),
    body("preferred_date")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("Valid date is required"),
    body("preferred_time").notEmpty().withMessage("Preferred time is required"),
  ],
  appointmentController.submit
);
// User Login/Register Page
router.get("/user-login", UserController.loginPage);

// Login Submit
router.post("/user-login", UserController.login);

// Register Submit
router.post("/user-register", UserController.register);

// User Dashboard Routes (Protected)


router.get("/dashboard", authUser, UserController.dashboard);
router.get("/my-appointments", authUser, UserController.myAppointments);

router.post("/update-profile", authUser, UserController.updateProfile);
router.post("/update-password", authUser, UserController.updatePassword);
router.post("/update-profile-image", authUser, UserController.updateProfileImage);

// Logout
router.get("/user-logout", UserController.logout);

module.exports = router;
