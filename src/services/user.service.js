import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"

const userFindByField = async (username, email) => {
  return await User.findOne({ $or: [{ username }, { email }] })
}

const createUser = async (newUser) => {
  return await User.create(newUser)
}

const findUserById = async (id) => {
  const user = await User.findById(id).select("-password -refreshToken")
  return { ...user._doc, id: user.id }
}

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)

    const accessToken = user.generateAccessToken()
    console.log("object user", { accessToken })
    const refreshToken = user.generateRefreshToken()
    console.log("object user", { accessToken, refreshToken })
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generate access and refresh token")
  }
}

const findByIdAndUpdate = async (id, updatedate = {}) => {
  return await User.findByIdAndUpdate(id, {
    $set: updatedate
  }, { new: true })
}

export { userFindByField, createUser, findUserById, generateAccessAndRefreshTokens, findByIdAndUpdate }