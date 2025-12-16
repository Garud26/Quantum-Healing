// controllers/homepageSettingController.js

const HomePageSetting = require('../models/HomePageSetting');

const order = ['patient-treated', 'feature', 'chiropractor', 'special-offer'];

// GET: Show homepage settings form
exports.index = async (req, res) => {
  try {
    const settings = await HomePageSetting.findAll();

    const data = {};
    order.forEach(sec => {
      const found = settings.find(s => s.section === sec);
      data[sec] = found || {
        section: sec,
        mediaType: sec === 'patient-treated' || sec === 'feature' ? 'video' : 'image',
        mediaUrl: '',
        content: `<p>Enter content for ${sec.replace(/-/g, ' ')} section here...</p>`
      };
    });

    res.render('admin/homepage-settings', {
      title: 'Homepage Settings',
      data,
      order,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    console.error('Error loading homepage settings:', err);
    req.flash('error', 'Failed to load homepage settings');
    res.redirect('/admin/dashboard');
  }
};

// POST: Save all sections
exports.update = async (req, res) => {
  try {
    const files = req.files || [];
    const { 
      videoUrl = [], 
      content = [], 
      currentMediaUrl = [] 
    } = req.body;

    let fileIndex = 0; // Only 2 image uploads allowed (chiropractor & special-offer)

    // Validate total uploaded files (security)
    if (files.length > 2) {
      req.flash('error', 'Maximum 2 images allowed');
      return res.redirect('/admin/homepage-settings');
    }

    for (let i = 0; i < order.length; i++) {
      const sec = order[i];
      let mediaUrl = '';
      let mediaTypeFinal = '';

      if (sec === 'patient-treated' || sec === 'feature') {
        // ========= VIDEO SECTION =========
        const inputUrl = (videoUrl[i] || '').toString().trim();

        // Use new URL or fallback to current
        mediaUrl = inputUrl || currentMediaUrl[i] || '';

        // Validate required
        if (!mediaUrl) {
          req.flash('error', `Video URL is required for "${sec.replace(/-/g, ' ')}" section`);
          return res.redirect('/admin/homepage-settings');
        }

        // Optional: Validate embed URL pattern
        if (!mediaUrl.includes('embed') && !mediaUrl.includes('youtu.be') && !mediaUrl.includes('vimeo.com')) {
          req.flash('error', `Please use a valid embed URL for "${sec.replace(/-/g, ' ')}"`);
          return res.redirect('/admin/homepage-settings');
        }

        mediaTypeFinal = 'video';

      } else {
        // ========= IMAGE SECTION =========
        const uploadedFile = files[fileIndex];
        if (uploadedFile) {
          mediaUrl = '/uploads/' + uploadedFile.filename;
          fileIndex++;
        } else {
          mediaUrl = currentMediaUrl[i] || '';
        }

        if (!mediaUrl) {
          req.flash('error', `Image is required for "${sec.replace(/-/g, ' ')}" section`);
          return res.redirect('/admin/homepage-settings');
        }

        mediaTypeFinal = 'image';
      }

      // Sanitize and set content from CKEditor
      const rawContent = (content[i] || '').toString().trim();
      const finalContent = rawContent || `<p>Enter content for ${sec.replace(/-/g, ' ')} here...</p>`;

      // Upsert (update or insert)
      await HomePageSetting.upsert({
        section: sec,
        mediaType: mediaTypeFinal,
        mediaUrl: mediaUrl,
        content: finalContent
      }, {
        conflict: ['section'] // For PostgreSQL; Sequelize handles MySQL/SQLite too
      });
    }

    req.flash('success', 'All homepage sections have been saved successfully!');
    res.redirect('/admin/homepage-settings');

  } catch (err) {
    console.error('Error saving homepage settings:', err);
    req.flash('error', 'Failed to save settings. Please try again.');
    res.redirect('/admin/homepage-settings');
  }
};