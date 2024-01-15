import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGN,
  credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// import routers
import userRouter from './routers/user.router.js'

// //declure routes
app.use("/api/v1/users", userRouter)

export { app }