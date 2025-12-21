// middleware/auth.js
module.exports = function (req, res, next) {
  // If this is an API request, don't redirect — just attach user info
  if (req.path && req.path.startsWith("/api")) {
    res.locals.user = req.session?.user || req.user || null;
    if (req.session?.user && !req.user) req.user = req.session.user;
    return next();
  }

  // For regular (non-API) routes, make user available in templates
  res.locals.user = req.session?.user || req.user || null;
  if (req.session?.user && !req.user) req.user = req.session.user;

  next();
};