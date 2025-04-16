import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description: String,
    website: String,
    location: String,
    logo: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

},{timestamps: true});

export const company = mongoose.model("Company" , companySchema);