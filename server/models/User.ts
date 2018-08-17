import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Document, model, Model, Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Artist from './Artist'
import Image from './Image'
import Medium from './Medium'
import Type from './Type'

// set response types
interface IAuth {
  username: string
  email: string
  firstname: string
  lastname: string
  photo: string
  confirmed?: string
  token: string
}

// set schema types
interface IUser extends Document {
  username: string
  email: string
  passwordHash: string
  firstname: string
  lastname: string
  verified?: string
  photo: string
  setPassword: (password: string) => string
  isValidPassword: (password: string) => boolean
  setVerificationToken: () => string
  generateJWT: () => string
  toAuthJSON: () => IAuth
}

const schema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      index: true,
      unique: true,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      lowercase: true
    },
    lastname: {
      type: String,
      lowercase: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    // change to s3 bucket
    photo: {
      type: String,
      default:
        'https://res.cloudinary.com/project-phantom/image/upload/v1523817544/global/blank-profile-picture.png'
    }
  },
  {
    timestamps: true
  }
)

// helper functions available for use when models imported

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10)
}

schema.methods.setVerificationToken = function setVerificationToken() {
  this.verifiedToken = this.generateJWT()
}

// schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
//   return `${process.env.HOST}/verification/${this.verifiedToken}`
// }

schema.plugin(uniqueValidator, { message: 'This email is already taken.' })

schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      id: this._id,
      photo: this.photo,
      email: this.email,
      username: this.username
    },
    process.env.JWT_SECRET
    // { expiresIn: 15 * 60 } // fix check for expired tokens! (redux middleware)
  )
}

schema.methods.getImages = function getImages(id) {
  return Image.find({ owner: id }).then(images => images)
}

// this function determines what is saved in localstorage
schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    firstname: this.firstname,
    lastname: this.lastname,
    photo: this.photo,
    confirmed: this.verified,
    token: this.generateJWT()
  }
}

export default model<IUser>('User', schema)
