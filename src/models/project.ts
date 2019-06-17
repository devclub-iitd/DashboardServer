import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
        enum:  ["IDEA","DOING","DEPLOYED"]
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    origin_contact: {
        type: String,
        required: true
    },
    perks: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    displayOnWebsite: {
        type: Boolean,
        required: true,
        default: false
    },
    isInternal: {
        type: Boolean,
        required: true,
        default: true
    },
    links: {
        type: Map,
        of: String
    },
    create_date: {
        type: Date,
        required: true,
        default: "01/01/1997"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    update_date: {
        type: Date,
        required: true,
        default: "01/01/1997"
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;