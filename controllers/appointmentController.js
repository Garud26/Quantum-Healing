// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const { validationResult } = require('express-validator');

exports.submit = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Collect error messages
    const errorMessages = errors.array().map(err => err.msg);
    req.flash('error', errorMessages.join(' '));
    
    // Save form data to repopulate fields
    req.flash('old', req.body);

    return res.redirect('/appointment'); // FIXED: was '/appointments'
  }

  try {
    const { name, email, phone, service, preferred_date, preferred_time, message } = req.body;

    await Appointment.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service.trim(),
      preferred_date,
      preferred_time,
      message: message ? message.trim() : null,
    });

    req.flash('success', 'Thank you! Your appointment request has been submitted successfully.');
    res.redirect('/appointment'); // FIXED: was '/appointments'
  } catch (err) {
    console.error('Appointment submission error:', err);
    req.flash('error', 'Something went wrong. Please try again later.');
    
    // Optional: repopulate form on server error
    req.flash('old', req.body);
    
    res.redirect('/appointment'); // FIXED: was '/appointments'
  }
};