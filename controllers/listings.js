const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("index.ejs", { allListings });
};

module.exports.renderCreateform = (req, res) => {
  console.log(req.user);

  res.render("create.ejs");
};

module.exports.renderDelete = async (req, res) => {
  let { id } = req.params;
  const deletedList = await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not Avaliable");
    res.redirect("/listings");
  }
  res.render("edit.ejs", { listing });
};

module.exports.update = async (req, res) => {
  let { id } = req.params;

  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  return res.redirect(`/listings/${id}`);
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not Avaliable");
    res.redirect("/listings");
  }
  res.render("show.ejs", { listing });
};
