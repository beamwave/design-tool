import { Document, model, Model, Schema } from 'mongoose'

// set schema types
interface IImage extends Document {
  name: string
  url: string
  owner: string
  type: string
  medium: string
  artist: string
  palette: string
  info: string
  tags: any[]
  comments: []
  height: number
  width: number
  trainingWheels: boolean
  deleted: boolean
}

const schema: Schema = new Schema(
  {
    name: {
      type: String
    },
    url: {
      type: String,
      unique: true
    },
    owner: {
      type: String
    },
    type: {
      type: String
    },
    medium: {
      type: String
    },
    artist: {
      type: String
    },
    palette: {
      type: String
    },
    info: {
      type: String
    },
    tags: {
      type: Array
    },
    comments: {
      type: [String]
    },
    trainingWheels: {
      type: Boolean
    },
    height: {
      type: Number
    },
    width: {
      type: Number
    },
    deleted: {
      type: Boolean
    }
  },
  {
    timestamps: true
  }
)

export default model<IImage>('Image', schema)
