import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const registerUser = asyncHandler( async (req, res) => {


    const {fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath)
    const coverimageLocalPath = req.files?.coverimage[0]?.path;
    console.log(coverimageLocalPath)
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    if (!coverimageLocalPath) {
        throw new ApiError(400, "cover image file is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatarLocalPath,
        coverimage: coverimageLocalPath,
        email, 
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const generateAccessandRefreshToken=async(userid)=>{
    try {
        const user=User.findById(userid)
    
        const RefreshToken=user.generateRefreshToken()
        const AccessToken=user.generateAccessToken()
    
        user.RefreshToken=RefreshToken
        await user.save({validatebeforesave:false})
        return {AccessToken,RefreshToken}
    } catch (error) {
        return error;
    }
} 

const loginUser=asyncHandler(async (req,res)=>{

    const {fullName,username,email,password}=req.body

    if(!username || !email){
        throw new ApiError(400,"invalid credentials")
    }

    const user=User.findOne({
        $or:[{username},{email}]

    })

    if(!user){
        throw new ApiError(400,"user not found")
    }

    const {accesstoken,refreshtoken}= await generateAccessandRefreshToken(user._id)

    const loggedin=await User.findById(user._id).select("-password -refreshToken")

    const Options={
        httpOnly:true,
        secure:true
    }

    return res.status(200).cookie("accessToken",accesstoken,Options).cookie("refreshToken",refreshtoken,Options).json(
         new ApiResponse(
            201,
            {
                user: loggedin,accesstoken,refreshtoken
            },
            "User is logged in "
        ) 
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            refreshToken:undefined
        }
    )

    const Options={
        httpOnly:true,
        secure:true
    }

    res.status(201).clearcookie(accessToken,Options).clearcookie(refreshToken,Options).json(new ApiResponse(201,"","User logged out succesfully"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})

const updatepassword=asyncHandler(async(req,res)=>{
     const {OldPassword,NewPassword,ConfirmNewPassword}=req.body

     if(NewPassword!==ConfirmNewPassword){
        throw new ApiError(201,"new and confirm password does not matches ")
     }

     const user=await User.findById(req.user._id)

     const CheckingPassword= await user.isPasswordCorrect(OldPassword)
     if(!CheckingPassword){
        throw new ApiError(400,"old password does not matches")
     }

     user.password=NewPassword
     await user.save({validatebeforesave:false})

     return res.status(200).json(new ApiResponse(201,"Password is succesfully changed"))



})

const CurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(201,req.user,"current user is fetched"))
})

const UpdateDetails=asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body
    if(!fullName || !email){
       throw new ApiError(400,"enter new credentials")
    }

    const user=User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                fullName,
                email
            }
        },
        {new:true}
        ).select("-password ")
    
        return res.send(201).json(
            new ApiResponse(201,user,"basic credentials updated")
        )


    
})

const UpdateAvatarImage=asyncHandler(async(req,res)=>{
    const avatarpath=req.file.path

    if(!avatarpath){
        return new ApiError(400,"enter avatar file")
    }

    const user=await User.findByIdAndUpdate(req.user._id,{
        $set:{
            avatar:avatarpath
        }
    },{
        new:true
    }).select("-password")

    return res.send(201).json(
         new ApiResponse(201,user,"user avatar image updated succesfully")
    )

})

const UpdateCoverImage=asyncHandler(async(req,res)=>{
    const coverpath=req.file.path

    if(!coverpath){
        return new ApiError(400,"enter cover image file")
    }

    const user=await User.findByIdAndUpdate(req.user._id,{
        $set:{
            coverimage:coverpath
        }
    },{
        new:true
    }).select("-password")

    return res.send(201).json(
         new ApiResponse(201,user,"user cover image updated succesfully")
    )

})

const getAccountDetails=asyncHandler(async(req,res)=>{
    const {username}=req.params

    if(!username?.trim()){
        return new ApiError(400,"invalid username")
    }
     
    const channel=await User.aggregate(
        {
            $match: {
                username:username.toLowerCase()
            }

    },
    {
       $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
       }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscription",
            as:"channelsSubscribedto"
        }
    },
    {
       $addFields:{
           NumberOfSubscribers:{
            $size:"$subscribers"
           },
           NumberOfChannelsSubscribedTO:{
            $size:"$channelsSubscribedto"
           },
           SubscribedOrNot:{
            $cond:{
                if:{$in:[req.user._id,"$subscribers"]},
                then:"true",
                else:"false"
            }
           }
       },
    },
    {
        $project:{
            fullName:1,
            username:1,
            avatar:1,
            coverimage:1,
            NumberOfSubscribers:1,
            NumberOfChannelsSubscribedTO:1,
            SubscribedOrNot:1,
        }
    }
    )

    if(!channel.length()){
        return new ApiError(400,"channel does not exist")
    }

    console.log(channel)

    return res.send(200).json(new ApiResponse(201,channel,"channel data recieved successfully"))
})


const getWatchHistory=asyncHandler(async(req,res)=>{

    const user=User.aggregate([
        {
            $match:mongoose.Types.ObjectId(req.user._id)
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:{
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:{
                            $project:{
                                fullname:1,
                                username:1,
                                avatar:1
                            }
                        }
                    }
                }
        }
        },
    ])

    console.log(user)

    return res.send(201).json(new ApiResponse(201,user,"watch history of user is fetched"))
})


export default {registerUser,loginUser,logoutUser,refreshAccessToken,updatepassword,CurrentUser,UpdateDetails,UpdateCoverImage,UpdateAvatarImage,getAccountDetails,getWatchHistory};