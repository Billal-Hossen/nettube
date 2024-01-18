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
    const refreshToken = user.generateRefreshToken()
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
  }, { new: true }).select("-password -refreshToken")
}

const changePasswordService = async ({ newPassword, oldPassword, id }) => {
  const user = await User.findById(id)
  const isPasswordValid = await user.isCorrectPassword(oldPassword)
  console.log(isPasswordValid)
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid old password")
  }
  user.password = newPassword
  return await user.save({ validateBeforeSave: false })
}

const getUserChannelProfilePipeline = (id, username) => {
  return [
    {
      $match: { username: username.toLowerCase() }
    },
    {
      $lookup: {
        from: "subcriptions",
        localField: "_id",
        forignField: "subcriber",
        as: "subcribers"
      }
    },
    {
      $lookup: {
        from: "subcriptions",
        localField: "_id",
        forignField: "channel",
        as: "subcribersTo"
      }
    },
    {
      $addFields: {
        subceibersCount: {
          $size: "$subcribers"
        },
        subcribersToCount: {
          $size: "$subcribersTo"
        },
        isSubcribed: {
          $cond: {
            if: { $in: [id, "$subcribers.subcriber"] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        username: 1,
        fullname: 1,
        email: 1,
        avatar: 1,
        coverImg: 1,
        subceibersCount,
        subcribersToCount,
        isSubcribed
      }
    }
  ]
}

const getUserChannelProfileService = async (id, username) => {
  return await User.aggregate(getUserChannelProfilePipeline(id, username))
}

export { userFindByField, createUser, findUserById, generateAccessAndRefreshTokens, findByIdAndUpdate, changePasswordService, getUserChannelProfileService }