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

userRouter.post('/register', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user)
        return res
          .status(406)
          .send({ err: true, message: 'Email is already in use' })

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
      })
      newUser.save().then(user => {
        res.send(formatUser(user))
        return
      })
    })
    .catch(err => next(err))
})
userRouter.post('/signin', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user && bcrypt.compareSync(req.body.password, user.password)) {
        res.send(formatUser(user))
        return
      }
      res.status(401).send({ err: true, message: 'Invalid email or password' })
    })
    .catch(err => next(err))
})
function formatUser(user) {
  const { _id, __v, password, ...signedUser } = user.toObject()
  return {
    ...signedUser,
    id: user.toObject()._id,
    token: generateToken(user.toObject()),
  }
}

export default userRouter
