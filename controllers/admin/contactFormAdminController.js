// controllers/admin/contactFormAdminController.js
const ContactForm = require('../../models/ContactForm');

exports.list = async (req, res) => {
  try {
    const forms = await ContactForm.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.render('admin/contact-forms', {
      title: 'Contact Form Messages',
      forms,
      messages: req.flash(), 
    });
  } catch (err) {
    console.error('Error fetching contact forms:', err);
    req.flash('error', 'Failed to load messages.');
    res.render('admin/contact-forms', {
      title: 'Contact Form Messages',
      forms: [],
      messages: req.flash(),
    });
  }
};