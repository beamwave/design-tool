import { Document, model, Model, Schema } from 'mongoose'

// set schema types
interface IType extends Document {
  name: string
  owner: string
  deleted: boolean
}

const schema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    owner: {
      type: String,
      required: true
    },
    deleted: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default model<IType>('Type', schema)
