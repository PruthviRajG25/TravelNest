const Listing = require("../models/listing");
const axios = require("axios");


// ============================
// INDEX
// ============================

module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    next(err);
  }
};


// ============================
// NEW FORM
// ============================

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};


// ============================
// CREATE LISTING (WITH MAP)
// ============================

module.exports.createListing = async (req, res, next) => {
  try {
    if (!req.body.listing) {
      req.flash("error", "Invalid data");
      return res.redirect("/listings");
    }

    // 🔥 GET COORDINATES FROM LOCATIONIQ
    const geoRes = await axios.get(
      "https://us1.locationiq.com/v1/search",
      {
        params: {
          key: process.env.LOCATIONIQ_TOKEN,
          q: req.body.listing.location,
          format: "json",
        },
      }
    );

    if (!geoRes.data || geoRes.data.length === 0) {
      req.flash("error", "Location not found");
      return res.redirect("/listings/new");
    }

    const { lat, lon } = geoRes.data[0];

    const newListing = new Listing(req.body.listing);

    // ✅ SAVE GEO DATA
    newListing.geometry = {
      type: "Point",
      coordinates: [lon, lat], // ⚠️ correct order
    };

    newListing.owner = req.user._id;

    // ✅ IMAGE UPLOAD
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();

    req.flash("success", "Listing Created!");
    res.redirect("/listings");

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong while creating listing");
    res.redirect("/listings/new");
  }
};


// ============================
// SHOW LISTING
// ============================

module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });

  } catch (err) {
    next(err);
  }
};


// ============================
// EDIT FORM
// ============================

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });

  } catch (err) {
    next(err);
  }
};


// ============================
// UPDATE LISTING
// ============================

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // ✅ UPDATE BASIC FIELDS
    Object.assign(listing, req.body.listing);

    // 🔥 UPDATE LOCATION → GEOCODE AGAIN
    const geoRes = await axios.get(
      "https://us1.locationiq.com/v1/search",
      {
        params: {
          key: process.env.LOCATIONIQ_TOKEN,
          q: listing.location,
          format: "json",
        },
      }
    );

    if (geoRes.data && geoRes.data.length > 0) {
      const { lat, lon } = geoRes.data[0];

      listing.geometry = {
        type: "Point",
        coordinates: [lon, lat],
      };
    }

    // ✅ IMAGE UPDATE
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.log(err);
    req.flash("error", "Update failed");
    res.redirect("/listings");
  }
};


// ============================
// DELETE LISTING
// ============================

module.exports.deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");

  } catch (err) {
    next(err);
  }
};