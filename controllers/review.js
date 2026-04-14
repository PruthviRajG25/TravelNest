

const Listing = require("../models/listing"); // ✅ FIXED (capital L)
const Review = require("../models/review");

// =====================
// CREATE REVIEW
// =====================

module.exports.createReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    const review = new Review(req.body.review);
    review.author = req.user._id;

    listing.reviews.push(review);

    await review.save();
    await listing.save();

    req.flash("success", "Review added!");
    res.redirect(`/listings/${req.params.id}`);

  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to add review");
    res.redirect("/listings");
  }
};

// =====================
// DELETE REVIEW
// =====================

module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId); // ✅ correct method

    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.log(err);
    req.flash("error", "Failed to delete review");
    res.redirect("/listings");
  }
};