const bcrypt = require("bcrypt");

module.exports = {

  myfirstAPI: (req, res) => {
    req.session.destroy((err) => {
      if (err) console.log(err);
      res.json({
        success: true,
        message: "Admin Logout Successfully",
      });
    });
  },
  
};
