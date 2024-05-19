const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
// index route

router.get("/", wrapAsync(listingController.index));

// create route
router.get("/new", isLoggedIn, listingController.renderCreateform);

// new route created
router.post(
  "/",
  wrapAsync(async (req, res, next) => {
    let result = listingSchema.validate(req.body);

    if (result.error) {
      throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

// show route

router.get("/:id", wrapAsync(listingController.show));

// edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,

  wrapAsync(listingController.renderEditForm)
);

// updated   complete
router.post("/:id", isLoggedIn, isOwner, wrapAsync(listingController.update));

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderDelete)
);

module.exports = router;
