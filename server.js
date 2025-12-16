const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const sequelize = require("./config/db");
const User = require("./models/User");
const multer = require("multer");



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
app.use(
  session({
    secret: "cmssecret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

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

// Routes
const adminRoutes = require("./routes/admin");
const frontendRoutes = require("./routes/frontend");

app.use("/admin", adminRoutes);
app.use("/", frontendRoutes);

// Routes Test
app.get("/", (req, res) => {
  res.send("Node CMS Project is Running Successfully 🚀");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

const attachUser = require('./middleware/auth'); // ← your middleware


app.use(attachUser); 

app.use('/admin', require('./routes/admin'));



