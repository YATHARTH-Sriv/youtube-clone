import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import asyncHandler from "../utils/asynchandler.js";

const VerifyJWT=asyncHandler(async(req,res,next)=>{
  const token=req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","")
  
  if(!token){
    throw new ApiError(400,"user does not exist")
  }

  const decode=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  const user=User.findById(decode._id)
  if(!user){
    throw new ApiError(400,"user does not exist")
  }
  req.user=user
  next()
})

export default VerifyJWT;