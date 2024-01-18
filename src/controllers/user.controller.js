import { userFindByField, createUser, findUserById, generateAccessAndRefreshTokens, findByIdAndUpdate, changePasswordService } from "../services/user.service.js";
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

  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required")
  }
  const avatar = await uploadFileOnCloudinary(avatarLocalPath)
  if (!avatar) {
    throw new ApiError(400, "Avatar is required")
  }
  let coverLocalPath
  let coverImg
  if (req.files && Array.isArray(req.files.coverImg) && req.files.coverImg.length > 0) {
    coverLocalPath = req.files.coverImg[0].path
    coverImg = await uploadFileOnCloudinary(coverLocalPath)
  }



  const newUserObj = {
    username: username.toLowerCase(),
    fullname: fullname,
    email,
    password,
    avatar: avatar.url,
    coverImg: coverImg?.url || ""
  }

  const user = await createUser(newUserObj)
  const createdUser = await findUserById(user._id)
  if (!createdUser) {
    throw new ApiError(500, "Something went wring while registering the user")
  }

  res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )
})

const login = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body
  if (!username && !email) {
    throw new ApiError(400, "username or email and password required")
  }
  const user = await userFindByField(username, email)
  if (!user) {
    throw new ApiError(404, "User does not exist")
  }
  const isPasswordValid = await user.isCorrectPassword(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials")
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
  const loggedInUser = await findUserById(user._id)
  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User Logged In Successfully"
      )
    )
})

const logout = asyncHandler(async (req, res, next) => {
  await findByIdAndUpdate(req.user?.id, { refreshToken: undefined })
  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {

        },
        "User Successfully Logout"
      )
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req?.user, "This is current user"))
})

const changePassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body
  if (!newPassword && !oldPassord) {
    throw new ApiError(400, "new and old password requird")
  }
  await changePasswordService({ newPassword, oldPassword, id: req.user?._id })
  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))
})

const userFileUpdate = async (fileName, req) => {
  const imageLocalPath = req.file.path
  if (!imageLocalPath) {
    throw new ApiError(400, `${fileName} is required`)
  }
  const image = await uploadFileOnCloudinary(imageLocalPath)
  if (!image?.url) {
    throw new ApiError(400, `Error while uploading on ${fileName}`)
  }

  return await findByIdAndUpdate(req.user?._id, { [fileName]: image.url })

}
const updateAvatar = asyncHandler(async (req, res) => {
  const user = await userFileUpdate("avatar", req)
  res.status(200).json(new ApiResponse(200, user, "Avatar is updated"))
})

const updateCoverImg = asyncHandler(async (req, res) => {
  const user = await userFileUpdate("coverImg", req)
  res.status(200).json(new ApiResponse(200, user, "coverImg is updated"))
})

export { register, login, logout, getCurrentUser, changePassword, updateAvatar, updateCoverImg }