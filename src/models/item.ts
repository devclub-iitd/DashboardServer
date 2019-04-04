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
    type: { // TODO: What was this for?
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    assignee: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    dueDate: {
        type: Date
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

const item = mongoose.model("Item", itemSchema);
export default item;