import { Document, model, Model, Schema } from 'mongoose'

// set schema types
interface ITag extends Document {
  name: string
  user: string
  attachedTo: string[]
  deleted: boolean
}

const schema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: String,
      required: true
    },
    attachedTo: {
      type: Array,
      required: true
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
)

export default model<ITag>('Tag', schema)
