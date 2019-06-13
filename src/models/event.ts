import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    displayOnWebsite: {
        type: Boolean,
        required: true,
        default: false
    },
    links: {
        type: Map,
        of: String
    },
}, { timestamps: true });

const event = mongoose.model("Event", eventSchema);
export default event;