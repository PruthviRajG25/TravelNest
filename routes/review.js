const express = require("express");
const router = express.Router({ mergeParams: true }); // Allows access to :id from the parent route
const Listing = require("../models/listing"); // Fixed: added ../
const Review = require("../models/review");   // Fixed: added ../
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

// ===============================
// POST REVIEW ROUTE
// ===============================
router.post("/", isLoggedIn, async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

        listing.reviews.push(newReview);
        
        await newReview.save();
        await listing.save();
        
        req.flash("success", "Review added successfully!");
        res.redirect(`/listings/${listing._id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not add review");
        res.redirect(`/listings/${req.params.id}`);
    }
});

// ===============================
// DELETE REVIEW ROUTE
// ===============================
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
    try {
        let { id, reviewId } = req.params;

        // $pull removes the review ID from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Could not delete review");
        res.redirect(`/listings/${req.params.id}`);
    }
});

module.exports = router;