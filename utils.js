import jwt from 'jsonwebtoken'

function generateToken(user) {
  //   console.log(user)
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
}
function isAuth(req, res, next) {
  const authorization = req.headers.authorization
  if (authorization) {
    jwt.verify(authorization, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' })
      } else {
        req.user = decode
        next()
      }
    })
  } else {
    res.status(401).send({ message: 'No Token' })
  }
}
export { generateToken, isAuth }
