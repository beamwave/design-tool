import User from '../../models/User'

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

  app.post('/refresh', async (req, res) => {
    const { credentials } = req.body

    console.log('hit refresh route')

    const user = await User.findById(credentials.id)

    try {
      if (user) res.json({ user: user.toAuthJSON() })
    } catch (err) {
      res.status(500).json({ errors: { global: 'Server error.' } })
    }
  })
}
