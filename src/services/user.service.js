import { User } from "../models/user.model.js"

const userFindByField = async (username, email) => {
  return await User.findOne({ $or: [{ username }, { email }] })
}

const createUser = async (newUser) => {
  return await User.create(newUser)
}

const findUserById = async (id) => {
  return await User.findById(id).select("-password -refreshToken")
}

export { userFindByField, createUser, findUserById }