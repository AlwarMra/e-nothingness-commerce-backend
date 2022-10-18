import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    customerId: { type: String, required: true },
    checkoutId: { type: String, required: true },
    products: [
      {
        id: { type: String, required: true },
        q: { type: Number, default: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    payment_status: { type: String, required: true },
    totalQ: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
)

const Order = new mongoose.model('Order', orderSchema)

export default Order
