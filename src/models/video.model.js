import mongoose from "mongoose";

const videoSchema= new mongoose.Schema(
    {
      videofile:{
          type: String, //cloudinary url se lena hai
          required:true
      },

      thumbnail:{
        type:String,
        required:true
      },

      title:{
        type:String,
        required:[true,"title is required"],
        index:true,

      },

      description:{
        type:String,
        required:[true,"descriptionis required"],
      },

    },
    {
        timestamps:true
    }
)

export const Video=mongoose.model("Video",videoSchema);