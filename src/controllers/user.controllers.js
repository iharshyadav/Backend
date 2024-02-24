import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessTokenAndRefreshToken = async (userId)=>{

   try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};

   } catch (error) {
     throw new ApiError(500,"something went wrong while genearting access and refresh tokens");
   }



}

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
    console.log("email : ", email)



    // validation - not empty

if ([email,password,username,fullName].some((field)=>
     field?.trim()=== "")
     ) {
    throw new ApiError(400,"All fields are required");
}


    // check if user already exists: username, email

const existsUser = await User.findOne({
    $or : [ { username }, { email } ]
})

if (existsUser) {
    throw new ApiError(409,"User already exists with same username or password. Please! change")
}


    // check for images, check for avatar

const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files && req.files.coverImage && req.files.coverImage[0] ? req.files.coverImage[0].path : null;

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
}

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
    password
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

} )

const loginUser = asyncHandler( async (req,res)=>{
   
    // find username and password from mongo (req.body)
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie
    

    const {username , password}  = req.body;
    console.log(username);
    console.log(password);

    if(!username || !password){
        throw new ApiError(400,"username or password is required");
    }

    const user = await User.findOne({ $or:
        {
            username
        },
     });

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const checkPassword = await user.isPasswordCorrect(password)


    if(!checkPassword){
       throw new ApiError(401,"Invalid User Credentials");
    }

    const { accessToken , refreshToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(" -password -refreshToken ");

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshtoken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser,refreshToken,accessToken
            },
            "user logged in Successfully"
        )
    )

})

const logoutUser = asyncHandler ( async (req,res)=>{
  
    
})

export { 
    registerUser,
    loginUser,
    logoutUser
 };