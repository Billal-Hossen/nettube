import { userFindByField, createUser, findUserById } from "../services/user.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";




const register = asyncHandler(async (req, res, next) => {

  const { username, email, fullname, password } = req.body
  if ([username, email, fullname, password].some(field => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await userFindByField(username, email)
  if (existedUser) {
    throw new ApiError(409, "User  with username or email already exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path
  const coverLocalPath = req.files?.coverImg[0]?.path
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required")
  }
  const avatar = await uploadFileOnCloudinary(avatarLocalPath)
  const coverImg = await uploadFileOnCloudinary(coverLocalPath)
  if (!avatar) {
    throw new ApiError(400, "Avatar is required")
  }

  const newUserObj = {
    username: username.toLowerCase(),
    fullname: fullname,
    email,
    password,
    avatar: avatar.url,
    coverImg: coverImg.url || ""
  }

  const user = await createUser(newUserObj)
  const createdUser = await findUserById(user._id)
  if (!createdUser) {
    throw new ApiError(500, "Something went wring while registering the user")
  }

  res.status(201).json(
    new ApiResponse(200, "User registed successfully", { ...createUser, id: createUser._id })
  )













  res.status(200).json({
    message: "controller okay!!"
  })
})

export { register }