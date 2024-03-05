import mongoose from "mongoose";
const subscriptionSchema=new mongoose.Schema({
    subscription:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

export const subscription=mongoose.model("subscription",subscriptionSchema)