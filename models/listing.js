const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: String,
  image: {
    filename: "listingimage",
    type: String,
    default: "",
    set: (v) => (v === "" ? "" : v),
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;
