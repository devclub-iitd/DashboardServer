import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required:true,
            trim:true,
        },
        description:{
            type:String,
            trim:true,
        },
        status:{
            type: String,
            required:true,
            default:'UPCOMING',
            trim:true,
            enum:['UPCOMING','COMPLETED','ONGOING'],
        },
        projectid:{
            type:[
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Project',
                },
            ],
        },
        assignedTo:{
            type:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
        },
        assignedBy:{
            type:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
        },
        start_date:{
            type:Date,
            required:true,
        },
        completed_OR_not:{
            type:Boolean,
            required:true,
        },
        end_date_OR_expected_completion_date:{
            type:Date,
            required:false,
        },

    },
    {timestamps:true}
)

const ToDo=mongoose.model('ToDo',todoSchema)
export default ToDo