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
    assignee: {
        type: String,
        required: true,
        trim: true
    },
    create_date: {
        type: Date,
        required: true,
        default: "01/01/1997"
    },
    created_by: {
        type: type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    update_date: {
        type: Date,
        required: true,
        default: "01/01/1997"
    },
    updated_by: {
        type: type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const event = mongoose.model("Event", eventSchema);
export default event;