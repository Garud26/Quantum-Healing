// routes/frontend.js
const express = require("express");
const router = express.Router();

const FrontController = require("../controllers/frontendControllers/frontController");
const contactFormController = require('../controllers/contactFormController');
const appointmentController = require('../controllers/appointmentController');

const { body, validationResult } = require('express-validator');

// APPLY MIDDLEWARE TO LOAD IMAGESLOGO FOR ALL FRONTEND VIEWS
router.use(FrontController.loadImagesLogo);  // This ensures imagesLogo is available on EVERY page

router.get("/", FrontController.home);
router.get("/about-us", FrontController.aboutUs);
router.get("/services", FrontController.services);
router.get("/blog", FrontController.blog);
router.get("/blog/:id", FrontController.blogDetail);   
router.get("/contact", FrontController.contact);
router.get("/appointment", FrontController.appointment);

// contact form 
router.post('/contact', 
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  contactFormController.submit
);

// Appointment form submission
router.post('/appointment',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('service').trim().notEmpty().withMessage('Service is required'),
    body('preferred_date').isDate({ format: 'YYYY-MM-DD' }).withMessage('Valid date is required'),
    body('preferred_time').notEmpty().withMessage('Preferred time is required'),
  ],
  appointmentController.submit
);

module.exports = router;