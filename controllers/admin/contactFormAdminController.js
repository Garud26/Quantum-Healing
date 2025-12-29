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

exports.update = async (req, res) => {
  try {
    const form = await ContactForm.findByPk(req.params.id);
    if (!form) {
      req.flash('error', 'Message not found.');
      return res.redirect('/admin/contact-forms');
    }

    await form.update({
      name: req.body.name.trim(),
      email: req.body.email.trim().toLowerCase(),
      subject: req.body.subject ? req.body.subject.trim() : null,
      message: req.body.message.trim()
    });

    req.flash('success', 'Message updated successfully.');
    res.redirect('/admin/contact-forms');
  } catch (err) {
    console.error('Error updating message:', err);
    req.flash('error', 'Failed to update message.');
    res.redirect('/admin/contact-forms');
  }
};

exports.delete = async (req, res) => {
  try {
    const form = await ContactForm.findByPk(req.params.id);
    if (!form) {
      req.flash('error', 'Message not found.');
      return res.redirect('/admin/contact-forms');
    }

    await form.destroy();
    req.flash('success', 'Message deleted successfully.');
    res.redirect('/admin/contact-forms');
  } catch (err) {
    console.error('Error deleting message:', err);
    req.flash('error', 'Failed to delete message.');
    res.redirect('/admin/contact-forms');
  }
};