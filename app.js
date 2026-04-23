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
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Models
const User = require("./models/user");

// Routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

const ExpressError = require("./utils/ExpressError.js");

// Database URL (Prioritizes Cloud, falls back to Local)
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust1";

async function main() {
    await mongoose.connect(dbUrl);
}

main()
    .then(() => console.log(" Database Connected"))
    .catch((err) => console.log(" DB Error:", err));

// Session Store Configuration
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET || "mysupersecret" },
    touchAfter: 24 * 3600 
});

const sessionConfig = {
    store,
    name: "travel_session",
    secret: process.env.SECRET || "mysupersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionConfig));
app.use(flash());

// Authentication Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Global Variables
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// Mounting Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// Static Pages
app.get("/privacy", (req, res) => res.render("pages/privacy.ejs"));
app.get("/terms", (req, res) => res.render("pages/terms.ejs"));

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(process.env.PORT || 8080, () => {
    console.log(` Server listening on port ${process.env.PORT || 8080}`);
});