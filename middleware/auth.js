// corrected auth.js
module.exports = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect("/admin/login");
  }
  next();
};

// middleware/auth.js

module.exports = function (req, res, next) {
  // Make user available in all templates
  res.locals.user = req.session?.user || req.user || null;

  // Optional: also make it available as req.user for consistency
  if (req.session?.user && !req.user) {
    req.user = req.session.user;
  }

  next();
};