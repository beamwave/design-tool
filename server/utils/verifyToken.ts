import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization

  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    // handle error
    if (err) {
      console.log('error ', err)
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' })
    }

    next()
  })
}
