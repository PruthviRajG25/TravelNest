const Listing = require("./models/listing");
const Review = require("./models/review");

// Check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

// Check if user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to edit/delete this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Check if user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You do not have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};