import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Project',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      enum: ['project', 'event', 'resource'],
    },
    due_date: {
      type: Date,
    },
    assignee: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
    labels: {
      type: [
        {
          type: String,
          lowercase: true,
          trim: true,
        },
      ],
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true
    },
  },
  {timestamps: true}
);

const item = mongoose.model('Item', itemSchema);
export default item;
