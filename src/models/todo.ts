import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
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
    
    due_date: {
      type: Date,
    },
    assigned_to: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    assigned_by: {
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
      enum: ['ongoing','completed','upcoming'],
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
  },
  {timestamps: true}
);

const todo = mongoose.model('Todo', todoSchema);
export default todo;
