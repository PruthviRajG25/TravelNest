const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelBuddySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    maxCompanions: {
        type: Number,
        default: 1
    },
    companions: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("TravelBuddy", travelBuddySchema);