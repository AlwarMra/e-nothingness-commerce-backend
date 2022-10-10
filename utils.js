import jwt from 'jsonwebtoken'

function generateToken(user) {
  //   console.log(user)
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
}

export { generateToken }
