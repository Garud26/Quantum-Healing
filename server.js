const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const sequelize = require("./config/db");
const User = require("./models/User");
const multer = require("multer");
const attachUser = require('./middleware/auth');

require("dotenv").config();
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
app.use("/uploads", express.static("public/uploads"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Session setup
app.use(
  session({
    secret: "cmssecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// ==================== CRITICAL FIX: Make session available in views ====================
app.use((req, res, next) => {
  res.locals.session = req.session;        // Now you can use <%= session.userName %> in EJS
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.message = req.flash("message"); // For custom messages in user auth
  next();
});
// =====================================================================================

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Explicitly set views folder

// Test DB Connection
sequelize
  .authenticate()
  .then(() => console.log("MySQL Connected Successfully ✔"))
  .catch((err) => console.log("DB Error: " + err));

sequelize.sync().then(() => {
  console.log("All Models Synced Successfully ✔");
});


app.use(attachUser);

// Routes
const adminRoutes = require("./routes/admin");
const frontendRoutes = require("./routes/frontend");

app.use("/admin", adminRoutes);
app.use("/", frontendRoutes);



// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));