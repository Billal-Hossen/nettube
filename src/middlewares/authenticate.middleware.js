import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findUserById } from "../services/user.service.js";

const authenticate = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new ApiError(401, "Unautorized request")
    }
    console.log(token)
    console.log(process.env.ACCESS_TOKEN_SCERECT)
    const algorithm = 'HS256'
    // const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SCERECT, { algorithms: [algorithm] })
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SCERECT, { algorithms: [algorithm] })
    console.log(decodeToken)
    const user = await findUserById(decodeToken._id)
    if (!user) {
      throw new ApiError(401, "Invalid access token")
    }
    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid token")
  }
})

export { authenticate }