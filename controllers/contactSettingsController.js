// controllers/contactSettingsController.js
const ContactSettings = require('../models/ContactSettings');
const ContactForm = require('../models/ContactForm');

exports.index = async (req, res) => {
  try {
    const setting = await ContactSettings.findOne() || {};
    const forms = await ContactForm.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.render('admin/contact-settings', {
      setting,
      forms,
      messages: req.flash()
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading contact settings.');
    res.redirect('/admin/dashboard');
  }
};

exports.update = async (req, res) => {
  try {
    let settings = await ContactSettings.findOne();

    const updates = {
      location_address: req.body.location_address?.trim() || null,
      phone_number: req.body.phone_number?.trim() || null,
      email: req.body.email?.trim() || null,
      map_url: req.body.map_url?.trim() || null,  // Only map_url now
    };

    if (req.files && typeof req.files === 'object') {
      const fileFields = ['location_image', 'phone_image', 'email_image'];
      fileFields.forEach(field => {
        if (req.files[field] && req.files[field][0]) {
          updates[field] = req.files[field][0].filename;
        }
      });
    }

    if (!settings) {
      await ContactSettings.create(updates);
    } else {
      await settings.update(updates);
    }

    req.flash('success', 'Contact settings updated successfully!');
    res.redirect('/admin/contact-settings');
  } catch (err) {
    console.error('Contact Settings Update Error:', err);
    req.flash('error', 'Failed to update contact settings.');
    res.redirect('/admin/contact-settings');
  }
};

exports.listForms = async (req, res) => {
  try {
    const forms = await ContactForm.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/contact-forms', {
      forms,
      messages: req.flash()
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading contact form messages.');
    res.redirect('/admin/dashboard');
  }
};