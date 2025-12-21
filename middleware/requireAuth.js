// middleware/requireAuth.js
module.exports = function (req, res, next) {
  // Don't enforce for API requests
  if (req.path && req.path.startsWith('/api')) return next();

  // If user not logged in, redirect to admin login
  if (!req.session || !req.session.user) {
    return res.redirect('/admin/login');
  }

  // User exists — proceed
  return next();
};
