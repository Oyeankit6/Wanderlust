const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_url = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.Data = initData.Data.map((obj) => ({
    ...obj,
    owner: "66323eef46e48bed59a9ca38",
  }));
  await Listing.insertMany(initData.Data);
  console.log("Data was initialized");
};

initDB();
