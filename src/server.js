import dotenv from 'dotenv'
import connectDB from '../src/db/index.js'
import { app } from './app.js'

dotenv.config({
  path: './.env'
})

const port = process.env.PORT || 8080

const main = async () => {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`App listing on http://localhost:${port}`)
    })

  } catch (error) {
    console.log("Database connection error!!", error)
  }
}