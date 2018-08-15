import User from '../../models/User'
import Image from '../../models/Image'
import parseErrors from '../../utils/parseErrors'
import { verifyToken } from '../../utils/verifyToken'

module.exports = app => {
  app.post('/signup', async (req, res) => {
    const { username, email, password, firstname, lastname } = req.body.user

    // create user
    const user = new User({ username, email, firstname, lastname })
    user.setPassword(password)
    user.setVerificationToken()

    // save user
    try {
      await user.save()
      res.json({ user: user.toAuthJSON() })
    } catch (err) {
      console.log('signup error: ', err.errors.email.message)
      res.status(400).json({ errors: { global: err.errors.email.message } })
    }
  })

  app.post('/login', async (req, res) => {
    const { credentials } = req.body

    // find user
    const user = await User.findOne({ username: credentials.username })

    try {
      if (user && user.isValidPassword(credentials.password))
        res.json({ user: user.toAuthJSON() })
      else res.status(400).json({ errors: { global: 'Invalid credentials.' } })
    } catch (err) {
      res.status(500).json({ errors: { global: 'Server error.' } })
    }
  })

  // // update user settings
  // app.post(
  //   '/general_settings',
  //   verifyToken,
  //   upload.single('file'),
  //   (req, res) => {
  //     const { email, username, newEmail } = req.body
  //     User.findOne({ email: req.body.email }).then(user => {
  //       if (newEmail.length > 0) {
  //         user.email = newEmail
  //       }
  //       if (username.length > 0) {
  //         user.username = username
  //       }
  //       if (req.file.path.length > 0) {
  //         cloudinary.v2.uploader.upload(
  //           req.file.path,
  //           {
  //             folder: `${user.id}/profile`, // folder name on cloudinary
  //             tags: [user.id] // tags for images
  //           },
  //           (e, result) => {
  //             if (e) {
  //               console.log('cloudinary error: ', e) // HANDLE BETTER FOR PROD
  //             } else {
  //               // overwrite profile image
  //               user.photo = result.secure_url
  //               user.save().then(user => {
  //                 res.json(user)
  //               })
  //             }
  //           }
  //         )
  //       } else {
  //         user.save().then(user => {
  //           res.json(user)
  //         })
  //       }
  //     })
  //   }
  // )
  // app.post('/password_settings', verifyToken, (req, res) => {
  //   User.findOne({ email: req.body.email }).then(user => {
  //     if (req.body.email.length) console.log('user found man: ', user)
  //   })
  // })
  // app.post('/transfer_settings', verifyToken, (req, res) => {
  //   User.findOne({ email: req.body.email }).then(user => {
  //     console.log('user found man: ', user)
  //   })
  // })
  // app.post('/get_user', verifyToken, (req, res) => {
  //   User.findOne({ email: req.body.email }).then(user => res.json(user))
  // })
}
