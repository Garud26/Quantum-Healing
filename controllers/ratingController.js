// controllers/ratingController.js

const Rating = require('../models/Rating');
const fs = require('fs');
const path = require('path');

exports.list = async (req, res) => {
  try {
    const ratings = await Rating.findAll({ order: [['createdAt', 'DESC']] });
    res.render('admin/ratings/list', { 
      ratings, 
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading ratings');
    res.redirect('/admin/dashboard');
  }
};

exports.addPage = (req, res) => {
  res.render('admin/ratings/add', { rating: null });
};

exports.add = async (req, res) => {
  try {
    const data = { ...req.body };
    
    if (req.file) {
      data.image = req.file.filename;
    }

    await Rating.create(data);
    req.flash('success', 'Rating added successfully');
  } catch (err) {
    console.error('Error adding rating:', err);
    req.flash('error', 'Error adding rating: ' + (err.message || 'Unknown error'));
  }
  res.redirect('/admin/ratings');
};

exports.editPage = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    if (!rating) {
      req.flash('error', 'Rating not found');
      return res.redirect('/admin/ratings');
    }
    res.render('admin/ratings/edit', { rating });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error loading rating');
    res.redirect('/admin/ratings');
  }
};

exports.update = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    if (!rating) {
      req.flash('error', 'Rating not found');
      return res.redirect('/admin/ratings');
    }

    const data = { ...req.body };

    if (req.file) {
      // Delete old image if exists
      if (rating.image) {
        const oldPath = path.join(__dirname, '..', 'public', 'uploads', rating.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      data.image = req.file.filename;
    }

    await rating.update(data); // Better: use instance.update()
    // OR: await Rating.update(data, { where: { id: req.params.id } });

    req.flash('success', 'Rating updated successfully');
  } catch (err) {
    console.error('Error updating rating:', err);
    req.flash('error', 'Error updating rating: ' + (err.message || 'Unknown error'));
  }
  res.redirect('/admin/ratings');
};

exports.delete = async (req, res) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    if (rating && rating.image) {
      const imagePath = path.join(__dirname, '..', 'public', 'uploads', rating.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await Rating.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Rating deleted successfully');
  } catch (err) {
    console.error('Error deleting rating:', err);
    req.flash('error', 'Error deleting rating');
  }
  res.redirect('/admin/ratings');
};