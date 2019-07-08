import mongoose from "mongoose";
import { isURL } from "validator";

const resourceSchema = new mongoose.Schema({
  internal_name: {
    type: String,
    required: true,
    trim: true
  },
  directory_year: {
    type: String,
    required: true,
    trim: true
  },
  subdirectory: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  archive: {
    type: Boolean,
    required: true,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true,
    validate: [ isURL, 'invalid url' ],
    default: "01/01/2019",
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
  },
  new: {
    type: Boolean,
    required: true,
    default: false
  },
  displayOnWebsite: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true });


const Resources = mongoose.model("Resource", resourceSchema);
export default Resources;
