import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler ( async (req,res)=>{
    
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res



    // get user details from frontend

    const {username,email,password,fullName,} = req.body
    console.log("email : ", email,"\npassword : ",password)
} )


    // validation - not empty

if ([email,password,username,fullName].some((fields)=>
     fields?.trim()=== "")
     ) {
    throw new ApiError(400,"All fields are required");
}


    // check if user already exists: username, email

const existsUser = User.findOne({
    $or : [ { username }, { email } ]
})

if (existsUser) {
    throw new ApiError(409,"User already exists with same username or password. Please! change")
}


    // check for images, check for avatar

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverImage[0]?.path;

if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required");
}

    // upload them to cloudinary, avatar

const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if (!avatar) {
    throw new ApiError(400,"Avatar file is required");
}

    // create user object - create entry in db

const user = await User.create({
    fullName,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
})


    // remove password and refresh token field from response

const createdUser = User.findById(user._id).select(
    "-password -refreshToken"
)

    // check for user creation
    
if (!createdUser) {
    throw new ApiError(500 , "Something went wrong while registering the user")
}    

    // return res

res.status(201).json(
    new ApiResponse(200 , createdUser , "User registered successfully")
)

export {registerUser,};