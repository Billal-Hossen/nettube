import mongoose from "mongoose";

let dbConnectionURI = process.env.MONGODB_URI
dbConnectionURI = dbConnectionURI.replace("<username>", process.env.DB_USER)
dbConnectionURI = dbConnectionURI.replace("<password>", process.env.DB_PASS)

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(dbConnectionURI, { dbName: process.env.DB_NAME })
    console.log(`Database connected successfully!! DB HOST: ${connectionInstance.connection.host}`)

  } catch (error) {
    console.log("Databse connection Failed!! :", error)
    process.exit(1)
  }
}

export default connectDB