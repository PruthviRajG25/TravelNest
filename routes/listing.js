const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const axios = require("axios");

// 1. INDEX
router.get("/", async (req, res) => {
    const { category } = req.query;
    let allListings = category ? await Listing.find({ category }) : await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// 2. NEW FORM
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// 3. CREATE
router.post("/", isLoggedIn, upload.single("image"), async (req, res) => {
    try {
        const { location } = req.body.listing;
        const token = process.env.LOCATIONIQ_TOKEN;
        const geoUrl = `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(location)}&format=json&limit=1`;
        const response = await axios.get(geoUrl);

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        if (req.file) newListing.image = { url: req.file.path, filename: req.file.filename };

        if (response.data && response.data.length > 0) {
            newListing.geometry = { type: "Point", coordinates: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)] };
        } else {
            newListing.geometry = { type: "Point", coordinates: [77.209, 28.613] };
        }

        await newListing.save();
        req.flash("success", "New Place Added!");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listings/new");
    }
});

// 4. EDIT FORM
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
});

// UPDATE ROUTE - Full Fix for Maps and Images
router.put("/:id", isLoggedIn, isOwner, upload.single("image"), async (req, res) => {
    try {
        let { id } = req.params;
        const { location } = req.body.listing;
        const token = process.env.LOCATIONIQ_TOKEN;

        // 1. Fetch NEW coordinates for the edited location
        const geoUrl = `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(location)}&format=json&limit=1`;
        const response = await axios.get(geoUrl);

        // 2. Update the basic listing data (title, price, description, etc.)
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        // 3. Update Geometry if the location was found
        if (response.data && response.data.length > 0) {
            listing.geometry = {
                type: "Point",
                coordinates: [parseFloat(response.data[0].lon), parseFloat(response.data[0].lat)]
            };
        }

        // 4. Update Image if a new file was uploaded
        if (typeof req.file !== "undefined") {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        await listing.save();
        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to update listing: " + err.message);
        res.redirect(`/listings/${req.params.id}/edit`);
    }
});

// 6. SHOW
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
});

// 7. DELETE
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
});

module.exports = router;