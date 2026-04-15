if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { default: MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models
const User = require("./models/user");
const Listing = require("./models/listing");

// Routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

// ===============================
// DATABASE CONNECTION
// ===============================
const dbUrl = process.env.ATLASDB_URL|| "mongodb://localhost:27017/wanderlust1";

mongoose.connect(dbUrl)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Database connection error:", err.message));

// ===============================
// SESSION STORE CONFIG
// ===============================
const secret = process.env.SECRET || "mysupersecret";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: secret
    },
    touchAfter: 24 * 3600 // time period in seconds
});

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e);
});

// ===============================
// APP CONFIG & MIDDLEWARE
// ===============================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// SESSION & PASSPORT CONFIG
// ===============================
const sessionConfig = {
    store: store, // Using the MongoStore instance created above
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// ===============================
// ROUTES
// ===============================
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => res.redirect("/listings"));

// Catch-all for undefined routes
app.all("/", (req, res, next) => {
    const err = new Error("Page Not Found");
    err.statusCode = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error.ejs", { err });
});

// ===============================
// SERVER
// ===============================
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});