import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
  members: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  status: {
    type: String,
    required: false,
    default: "IDEA",
    uppercase: true,
    trim: true,
    enum:  ["IDEA","ONGOING","DEPLOYED"]
  },
  start_date: {
    type: Date,
    // required: true
  },
  end_date: {
    type: Date,
    // required: true
  },
  origin: {
    type: String,
    // required: true
  },
  origin_contact: {
    type: String,
    // required: true
  },
  perks: {
    type: String,
    // required: true
  },
  requirements: {
    type: String,
    // required: true
  },
  display_on_website: {
    type: Boolean,
    required: true,
    default: false
  },
  is_internal: {
    type: Boolean,
    required: true,
    default: true
  },
  showcase: {
    type: Boolean,
    required: true,
    default: false
  },  
  labels: {
    type: [{
      type: String,
      lowercase: true
    }]
  },
  url: {
    type: Map,
    of: String
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

const Project = mongoose.model("Project", projectSchema);
export default Project;