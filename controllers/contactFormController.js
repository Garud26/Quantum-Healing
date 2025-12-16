// controllers/contactFormController.js
const ContactForm = require('../models/ContactForm');
const { validationResult } = require('express-validator');

exports.submit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Please fill all fields correctly.');
    return res.redirect('/contact');
  }

  try {
    const { name, email, subject, message } = req.body;

    await ContactForm.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    req.flash('success', 'Thank you! Your message has been sent successfully.');
    res.redirect('/contact');
  } catch (err) {
    console.error('Contact form submission error:', err);
    req.flash('error', 'Something went wrong. Please try again later.');
    res.redirect('/contact');
  }
};