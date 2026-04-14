const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const { data } = require("./data.js"); // Assuming your array is in data.js

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust1";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); // Clears existing data
  
  // IMPORTANT: Map your user ID as the owner for all sample listings
  const initData = data.map((obj) => ({
    ...obj,
    owner: "65c123abc456def789012345", // REPLACE with an actual User ID from your DB
  }));

  await Listing.insertMany(initData);
  console.log("Data was initialized");
};

initDB();