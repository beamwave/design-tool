import User from '../../models/User'
import { verifyToken } from '../../utils/verifyToken'

module.exports = app => {
  // app.post('/api/stripe', verifyToken, (req, res) => {
  //   const { email, qty, id, key } = req.body
  //   User.findOne({ email }).then(async user => {
  //     if (user.stripe.length > 0) {
  //       // attempt to add card information to stripe customer
  //       try {
  //         const source = await stripe.customers.update(user.stripe, {
  //           source: id
  //         })
  //       } catch (e) {
  //         console.log(`customer update error: ${e}`)
  //       }
  //       // attempt to charge stripe customer with newly added card
  //       try {
  //         // find customer
  //         const recipient = await stripe.customers.retrieve(user.stripe)
  //         const charge = await stripe.charges.create({
  //           amount: (qty - 1) * 100 + 99,
  //           currency: 'usd',
  //           description: '0.99¢ for account',
  //           customer: recipient.id
  //         })
  //         if (user.available + +qty <= 96) {
  //           user.available += +qty
  //         }
  //         const patron = await user.save()
  //         console.log('user saved. Now sending to client...')
  //         res.json(patron)
  //       } catch (e) {
  //         console.log(`customer charge error: ${e}`)
  //       }
  //     } else {
  //       console.log('User was not found. Creating new stripe customer.')
  //       const customer = await stripe.customers.create({
  //         email: user.email,
  //         source: req.body.id
  //       })
  //     }
  //   })
  // })
}
