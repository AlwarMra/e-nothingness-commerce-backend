import express from 'express'
import mongoose from 'mongoose'

import User from '../models/User.js'
import data from '../data.js'

const seedRouter = express.Router()

seedRouter.get('/', async (req, res) => {
  await User.deleteMany({}).then(deleted => {
    if (deleted.acknowledged) {
      User.insertMany(data.users).then(users => {
        res.json(users)
      })
    }
  })
})

export default seedRouter
