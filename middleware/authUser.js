// middleware/authUser.js

module.exports = function (req, res, next) {
  if (req.session && req.session.userId) {
   
    res.locals.user = {
      id: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail,
      profile_img: req.session.userProfileImg || "/front-assets/images/default-user.jpg"
    };
    return next();
  }

  req.flash("message", "Please login to access your dashboard");
  res.redirect("/user-login");
};