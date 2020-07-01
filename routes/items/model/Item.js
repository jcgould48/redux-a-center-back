const mongoose = require("mongoose");
const moment = require("moment");

const ItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: "Item name is required",
  },
  rentAmount: {
    type: Number,
    required: "Rent amount is required",
  },
  description: {
    type: String,
    required: "Description is required",
  },
  dateInput: {
    type: Date,
  },
  availability: {
    type: Boolean,
    // required: "Availability is required",
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "User" },
  created: {
    type: String,
    default: () => {
      const now = moment();
      return now.format("dddd, MMMM Do YYYY, h:mm:ss a");
    },
  },
});

module.exports = mongoose.model("Item", ItemSchema);
