import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import seedRouter from './routes/seedRoutes.js'
import stripeRouter from './routes/stripeRoutes.js'
import handleError from './middlewares/handleError.js'

dotenv.config()
const port = process.env.PORT || 5000

// Express App
const app = express()
app.use(cors())
app.use('/api/checkout/webhook', express.raw({ type: '*/*' })) // --> Stripe webhook events need raw data and not parsed as json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mongoose connection
const connectionString = process.env.MONGO_URI
mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Database connected')
  })
  .catch(err => {
    console.error(err.message)
  })

process.on('uncaughtException', () => {
  mongoose.connection.close()
})

// Routes
app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/seeds', seedRouter)
app.use('/api/checkout', stripeRouter)

// Middleware
app.use(handleError)

app.listen(port, () => {
  console.log(`Server on port${port}`)
})
