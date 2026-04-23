const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    geometry: {
        type: { type: String, enum: ["Point"], required: true },
        coordinates: { type: [Number], required: true }
    },
    category: {
        type: String,
        enum: ["Trending",  "Mountains", "Homes","Beachfront"]
    },
    // New Feature Fields
    wifiSpeed: { type: Number, default: 0 },
    wifiScreenshot: {
        url: String,
        filename: String,
    }
});

module.exports = mongoose.model("Listing", listingSchema);