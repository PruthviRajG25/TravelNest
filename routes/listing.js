const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const Booking = require("../models/booking"); // Import your Booking model
const TravelBuddy = require("../models/travelBuddy");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const axios = require("axios");

// ==========================================
// 1. INDEX & SEARCH
// ==========================================
router.get("/", async (req, res) => {
    const { category, q } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: "i" } },
            { location: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ];
    }

    try {
        const allListings = await Listing.find(filter);
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        req.flash("error", "Could not fetch listings");
        res.redirect("/listings");
    }
});

// ==========================================
// 2. MY BOOKINGS (Must be above /:id)
// ==========================================
router.get("/bookings", isLoggedIn, async (req, res) => {
    try {
        const allBookings = await Booking.find({ user: req.user._id }).populate("listing");
        res.render("listings/allBookings.ejs", { allBookings });
    } catch (err) {
        req.flash("error", "Could not retrieve bookings.");
        res.redirect("/listings");
    }
});

// ==========================================
// 2.5. DELETE BOOKING
// ==========================================
router.delete("/bookings/:bookingId", isLoggedIn, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            req.flash("error", "Booking not found.");
            return res.redirect("/listings/bookings");
        }
        if (!booking.user.equals(req.user._id)) {
            req.flash("error", "You can only cancel your own bookings.");
            return res.redirect("/listings/bookings");
        }
        await Booking.findByIdAndDelete(bookingId);
        req.flash("success", "Booking cancelled successfully.");
        res.redirect("/listings/bookings");
    } catch (err) {
        req.flash("error", "Failed to cancel booking.");
        res.redirect("/listings/bookings");
    }
});

// ==========================================
// 3. NEW FORM (Must be above /:id)
// ==========================================
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// ==========================================
// 4. CREATE LISTING
// ==========================================
router.post("/", isLoggedIn, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'wifiScreenshot', maxCount: 1 }
]), async (req, res) => {
    try {
        const { location } = req.body.listing;
        const token = process.env.LOCATIONIQ_TOKEN;
        
        const geoUrl = `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(location)}&format=json&limit=1`;
        const response = await axios.get(geoUrl);

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (req.files['image']) {
            newListing.image = { url: req.files['image'][0].path, filename: req.files['image'][0].filename };
        }
        if (req.files['wifiScreenshot']) {
            newListing.wifiScreenshot = { url: req.files['wifiScreenshot'][0].path, filename: req.files['wifiScreenshot'][0].filename };
        }

        if (response.data && response.data.length > 0) {
            newListing.geometry = { 
                type: "Point", 
                coordinates: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)] 
            };
        } else {
            newListing.geometry = { type: "Point", coordinates: [77.209, 28.613] };
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings/new");
    }
});

// ==========================================
// 5. BOOK NOW LOGIC
// ==========================================
router.post("/:id/book", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const { bookingDateTime } = req.body;
        if (!bookingDateTime) {
            req.flash("error", "Please choose a date and time for your booking.");
            return res.redirect(`/listings/${id}`);
        }
        const parsedDate = new Date(bookingDateTime);
        if (isNaN(parsedDate.getTime())) {
            req.flash("error", "Invalid booking date and time.");
            return res.redirect(`/listings/${id}`);
        }

        const newBooking = new Booking({
            listing: id,
            user: req.user._id,
            bookingDateTime: parsedDate
        });
        await newBooking.save();
        req.flash("success", "Booking confirmed! View it in your trips.");
        res.redirect("/listings/bookings");
    } catch (err) {
        req.flash("error", "Booking failed. Try again.");
        res.redirect(`/listings/${req.params.id}`);
    }
});

// ==========================================
// 6. EDIT FORM
// ==========================================
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
});

// ==========================================
// 7. UPDATE LISTING (Map Fix)
// ==========================================
router.put("/:id", isLoggedIn, isOwner, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'wifiScreenshot', maxCount: 1 }
]), async (req, res) => {
    try {
        let { id } = req.params;
        const { location } = req.body.listing;
        const token = process.env.LOCATIONIQ_TOKEN;

        const geoUrl = `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(location)}&format=json&limit=1`;
        const response = await axios.get(geoUrl);

        let listing = await Listing.findById(id);
        Object.assign(listing, req.body.listing);

        if (response.data && response.data.length > 0) {
            listing.geometry = {
                type: "Point",
                coordinates: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)]
            };
        }

        if (req.files['image']) {
            listing.image = { url: req.files['image'][0].path, filename: req.files['image'][0].filename };
        }
        if (req.files['wifiScreenshot']) {
            listing.wifiScreenshot = { url: req.files['wifiScreenshot'][0].path, filename: req.files['wifiScreenshot'][0].filename };
        }

        await listing.save(); 
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        req.flash("error", "Update failed.");
        res.redirect(`/listings/${req.params.id}/edit`);
    }
});

// ==========================================
// TRAVEL BUDDIES ROUTES
// ==========================================

// 1. LIST TRAVEL BUDDIES
router.get("/travel-buddies", async (req, res) => {
    try {
        const now = new Date();
        // Only show upcoming trips
        const allBuddies = await TravelBuddy.find({ startDate: { $gte: now } })
            .populate("user")
            .populate("companions")
            .sort({ startDate: 1 }); // Sort by earliest first
        res.render("listings/travelBuddies.ejs", { allBuddies });
    } catch (err) {
        req.flash("error", "Could not fetch travel buddies");
        res.redirect("/listings");
    }
});

// 2. NEW TRAVEL BUDDY FORM
router.get("/travel-buddies/new", isLoggedIn, (req, res) => {
    res.render("listings/newTravelBuddy.ejs");
});

// 3. CREATE TRAVEL BUDDY
router.post("/travel-buddies", isLoggedIn, async (req, res) => {
    try {
        const { destination, startDate, endDate, description, maxCompanions } = req.body;
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();
        
        // Validation
        if (start <= now) {
            req.flash("error", "Start date must be in the future.");
            return res.redirect("/listings/travel-buddies/new");
        }
        if (end <= start) {
            req.flash("error", "End date must be after start date.");
            return res.redirect("/listings/travel-buddies/new");
        }
        
        const newBuddy = new TravelBuddy({
            user: req.user._id,
            destination,
            startDate: start,
            endDate: end,
            description,
            maxCompanions: parseInt(maxCompanions) || 1
        });
        await newBuddy.save();
        req.flash("success", "Travel buddy post created! Find companions for your trip.");
        res.redirect("/listings/travel-buddies");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings/travel-buddies/new");
    }
});

// 4. JOIN TRAVEL BUDDY
router.post("/travel-buddies/:id/join", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const buddy = await TravelBuddy.findById(id).populate("companions");
        if (!buddy) {
            req.flash("error", "Travel buddy not found");
            return res.redirect("/listings/travel-buddies");
        }
        
        const now = new Date();
        if (buddy.startDate <= now) {
            req.flash("error", "Cannot join trips that have already started");
            return res.redirect("/listings/travel-buddies");
        }
        
        if (buddy.user.equals(req.user._id)) {
            req.flash("error", "You cannot join your own trip");
            return res.redirect("/listings/travel-buddies");
        }
        if (buddy.companions.some(c => c.equals(req.user._id))) {
            req.flash("error", "You are already a companion");
            return res.redirect("/listings/travel-buddies");
        }
        if (buddy.companions.length >= buddy.maxCompanions) {
            req.flash("error", "Trip is full");
            return res.redirect("/listings/travel-buddies");
        }
        buddy.companions.push(req.user._id);
        await buddy.save();
        req.flash("success", "Joined the travel buddy group! Safe travels!");
        res.redirect("/listings/travel-buddies");
    } catch (err) {
        req.flash("error", "Failed to join");
        res.redirect("/listings/travel-buddies");
    }
});

// 5. DELETE TRAVEL BUDDY
router.delete("/travel-buddies/:id", isLoggedIn, async (req, res) => {
    try {
        const { id } = req.params;
        const buddy = await TravelBuddy.findById(id);
        if (!buddy) {
            req.flash("error", "Travel buddy not found");
            return res.redirect("/listings/travel-buddies");
        }
        if (!buddy.user.equals(req.user._id)) {
            req.flash("error", "You can only delete your own travel buddy requests");
            return res.redirect("/listings/travel-buddies");
        }
        await TravelBuddy.findByIdAndDelete(id);
        req.flash("success", "Travel buddy request deleted successfully");
        res.redirect("/listings/travel-buddies");
    } catch (err) {
        req.flash("error", "Failed to delete travel buddy request");
        res.redirect("/listings/travel-buddies");
    }
});

// ==========================================
// 8. SHOW LISTING
// ==========================================
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let avgRating = 0;
    if (listing.reviews.length > 0) {
        let total = listing.reviews.reduce((acc, curr) => acc + curr.rating, 0);
        avgRating = (total / listing.reviews.length).toFixed(1); 
    }

    res.render("listings/show.ejs", { listing, avgRating });
});

// ==========================================
// 9. DELETE LISTING
// ==========================================
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});

module.exports = router;