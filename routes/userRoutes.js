import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../utils.js'

const userRouter = express.Router()

userRouter.get('/', (req, res) => {
  User.find({}).then(users => {
    res.json(users)
  })
})

userRouter.post('/signin', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const { _id, __v, ...signedUser } = user.toObject()
        res.send({
          ...signedUser,
          id: user.toObject()._id,
          token: generateToken(user.toObject()),
        })
        return
      }
      res.status(401).send({ err: true, message: 'Invalid email or password' })
    })
    .catch(err => next(err))
})

export default userRouter
