import mongoose from "mongoose";

const userSchema= new mongoose.Schema(
    {
      username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        
      },
      email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      fullname:{
        type:String,
        required: true,
        index:true,
      },
       password:{
        type:String,
        required: true,
      },
      avatar:{
        type:String,
        required: true,
      },
      coverimage:{
         type: String,
         required:true,
      },

      watchhistory:[
        
      ]
    }
)

export const User=mongoose.model("User",userSchema);

