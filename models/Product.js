import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    vendor: String,
    image: { type: String, required: true },
    countInStock: Number,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
      },
    },
  },
)

const Product = new mongoose.model('Product', productSchema)

export default Product
