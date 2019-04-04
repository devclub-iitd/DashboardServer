import mongoose from "mongoose";
import { isEmail, isMobilePhone } from 'validator';

// export interface IUser extends mongoose.Document {
//     email: string;
//     name: string;
//     entryNumber: string;
//     hostel: string;
//     gender: string;
//     joinYear: Date;
//     gradYear: Date;
//     birthDate: Date;
//     mobileNumber: Date;
//     hometown: string;
//     interests: string;
//     specialization?: string;
//     intro: string;
//     displayOnWebsite: boolean;
//     links?: {[key: string]: string };
//     createdAt?: Date;
//     updatedAt?: Date;
// };


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [ isEmail, 'invalid email' ],
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    entryNumber: {
        type: String,
        required: true,
        uppercase: true,
        unique: true,
        minlength: 11,
        maxlength: 11,
        trim: true,
        index: true
    },
    hostel: {
        type: String,
        required: true,
        uppercase: true,
        minlength: 4,
        maxlength: 15,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum:  ["male","female"]
    },
    joinYear: {
        type: Date,
        required: true
    },
    gradYear: {
        type: Date,
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true,
        validate: [ (mob)=>isMobilePhone(mob,'any',{strictMode: true}), 'invalid mobile number']
    },
    hometown: {
        type: String,
        required: true
    },
    interests: {
        type: String,
        required: true
    },
    specialization: {
        type: String
    },
    intro: {
        type: String,
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


const User = mongoose.model("User", userSchema);
export default User;
