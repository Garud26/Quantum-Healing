// controllers/aboutUsSettingController.js
const AboutUsSetting = require('../models/AboutUsSetting');
const path = require('path');
const fs = require('fs');

const index = async (req, res) => {
  try {
    const setting = await AboutUsSetting.findOrCreateDefault();
    res.render('admin/about-us-settings', { 
      title: 'About Us Settings',
      setting,
      user: req.user,
      messages: {
        success: req.flash('success')[0] || null,
        error: req.flash('error')[0] || null
      }
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load About Us settings');
    res.redirect('/admin/dashboard');
  }
};

const update = async (req, res) => {
  try {
    const setting = await AboutUsSetting.findOrCreateDefault();

    const updates = {
      video_url: req.body.video_url || null
    };

    // Handle rich text content
    updates.about_me_content = req.body.about_me_content || '';
    updates.who_we_are_content = req.body.who_we_are_content || '';
    updates.we_offer_content = req.body.we_offer_content || '';

    // Handle image uploads
    const imageFields = ['about_me_image', 'who_we_are_image', 'we_offer_image'];
    
    imageFields.forEach(field => {
      if (req.files && req.files[field] && req.files[field][0]) {
        const file = req.files[field][0];
        updates[field] = file.filename;

        // Delete old image if exists
        if (setting[field]) {
          const oldPath = path.join(__dirname, '../public/uploads', setting[field]);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
      }
    });

    await setting.update(updates);
    req.flash('success', 'About Us Settings updated successfully!');
    
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update settings. Please try again.');
  }

  res.redirect('/admin/about-us-settings');
};

module.exports = { index, update };