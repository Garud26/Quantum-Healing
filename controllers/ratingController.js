// controllers/ratingController.js
const Rating = require('../models/Rating');

exports.list = async (req, res) => {
  const ratings = await Rating.findAll({ order: [['createdAt', 'DESC']] });
  res.render('admin/ratings/list', { 
    ratings, 
    success: req.flash('success'),
    error: req.flash('error')
  });
};

exports.addPage = (req, res) => {
  res.render('admin/ratings/add', { rating: null });
};

exports.add = async (req, res) => {
  try {
    await Rating.create(req.body);
    req.flash('success', 'Rating added successfully');
  } catch (err) {
    req.flash('error', 'Error adding rating');
  }
  res.redirect('/admin/ratings');
};

exports.editPage = async (req, res) => {
  const rating = await Rating.findByPk(req.params.id);
  if (!rating) return res.redirect('/admin/ratings');
  res.render('admin/ratings/edit', { rating });
};

exports.update = async (req, res) => {
  try {
    await Rating.update(req.body, { where: { id: req.params.id } });
    req.flash('success', 'Rating updated');
  } catch (err) {
    req.flash('error', 'Error updating');
  }
  res.redirect('/admin/ratings');
};

exports.delete = async (req, res) => {
  await Rating.destroy({ where: { id: req.params.id } });
  req.flash('success', 'Rating deleted');
  res.redirect('/admin/ratings');
};