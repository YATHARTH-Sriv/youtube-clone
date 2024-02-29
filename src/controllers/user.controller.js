import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js";


const registerUser=asyncHandler(async(req,res)=>{

     const {fullname, username, email, password}=req.body
    // console.log("email",email) 


    if(fullname===""){
        throw new ApiError(400,"you need to enter fullname") // apierror ki jagah we can even use apna res.error functionality
    }
    if(username===""){
        throw new ApiError(400,"enter valid username")
    }
    if(email==="" || !(email.includes("@"))){
        throw new ApiError(400,"enter valid email")
    }
    if(password===""){
        throw new ApiError(400,"enter a password")
    }

    const existinguser= await User.findOne({
        $or:[ {username} , {email} ]
    })

    if(existinguser){
        throw new ApiError(400,"User already exists")
    }

    const avatarlocalpath=await req.files?.avatar[0]?.path
    const coverimagelocalpath=await req.files?.coverimage[0]?.path

    if(!avatarlocalpath){
        throw new ApiError(400,"not found")
    }
    if(!coverimagelocalpath){
        throw new ApiError(400,"not found")
    }

    const avatar=await uploadOnCloudinary(avatarlocalpath)
    const coverImage=await uploadOnCloudinary(coverimagelocalpath)
    

    if(!avatar){
        throw new ApiError(400,"upload an avatar")
    }

    const user= await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverImage?.url || "",
        email,
        password
    })

    const CreatedUser=await User.findById(user_id).select("-password -refreshToken")

    if(CreatedUser){
        return new ApiResponse(200,CreatedUser);
    }


})

const loginUser=asyncHandler(async(req,res)=>{
    const{username,email,password}=req.body

    if(!username || !email){
        throw new ApiError(401,"enter correct details")
    }

    const user=User.findOne({
        $or:[{username},{email}]
    })

    





})

export default registerUser;