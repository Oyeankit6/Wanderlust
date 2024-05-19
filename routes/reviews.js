const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");

// Create a review
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    try {
      let listing = await Listing.findById(req.params.id);
      if (!listing) {
        throw new ExpressError("Listing not found", 404);
      }

      let newReview = new Review(req.body.review);
      // newReview.rating = req.body.rating; // Assuming rating is a property of the review

      listing.reviews.push(newReview);

      await newReview.save();
      await listing.save();

      req.flash("success", "Comment Added");
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      next(err); // Pass the error to the error handling middleware
    }
  })
);

// Delete a review
router.delete(
  "/:reviewid",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    try {
      const { id, reviewid } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        throw new ExpressError("Listing not found", 404);
      }

      // Remove the review from the listing's reviews array
      listing.reviews.pull(reviewid);
      await listing.save();

      // Delete the review from the database
      await Review.findByIdAndDelete(reviewid);
      req.flash("success", "reviwe Deleted!");
      res.redirect(`/listings/${id}`);
    } catch (err) {
      next(err); // Pass the error to the error handling middleware
    }
  })
);

module.exports = router;
