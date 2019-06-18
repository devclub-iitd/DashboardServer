import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project',
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        enum:  ["project", "event", "resource"]
    },
    dueDate: {
        type: Date
    },
    assignee: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    status: {
        type: String,
        trim: true,
        required: true
    },
    labels: {
        type: [{
            type: String,
            lowercase: true,
            trim: true
        }]
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    create_date: {
        type: Date,
        // required: true,
        default: "01/01/1997"
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    update_date: {
        type: Date,
        // required: true,
        default: "01/01/1997"
    },
    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    }
}, { timestamps: true });

const item = mongoose.model("Item", itemSchema);
export default item;