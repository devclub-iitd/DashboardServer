import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    // required: true,
    trim: true
  },
  start_date: {
    type: Date,
    // required: true
  },
  end_date: {
    type: Date,
    // required: true
  },
  embed_code: {
    type: String,
    // required: true
  },
  display_on_website: {
    type: Boolean,
    required: true,
    default: false
  },
  url: {
    type: Map,
    of: String
  },
  assignee: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  }
}, { timestamps: true });

const event = mongoose.model("Event", eventSchema);
export default event;