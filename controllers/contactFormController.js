// controllers/contactFormController.js
const ContactForm = require('../models/ContactForm');
const { validationResult } = require('express-validator');
const sendMail = require("../utils/mailer"); // ← Add this line

exports.submit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', 'Please fill all fields correctly.');
    return res.redirect('/contact');
  }

  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    await ContactForm.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    /* =========================
       📧 EMAIL TO ADMIN
    ========================= */
    await sendMail({
      to: process.env.ADMIN_MAIL,
      subject: "New Contact Form Message",
      html: `
        <h2>New Contact Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    /* =========================
       📧 EMAIL TO USER (Auto-reply)
    ========================= */
    await sendMail({
      to: email,
      subject: "We Received Your Message",
      html: `
        <h2>Thank You, ${name}!</h2>
        <p>We have received your message and appreciate you reaching out.</p>

        <h4>Your Message Details:</h4>
        <ul>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>

        <p>Our team will get back to you as soon as possible.</p>
        <p>Thank you!</p>
      `,
    });

    req.flash('success', 'Thank you! Your message has been sent successfully.');
    res.redirect('/contact');
  } catch (err) {
    console.error('Contact form submission error:', err);
    req.flash('error', 'Something went wrong. Please try again later.');
    res.redirect('/contact');
  }
};