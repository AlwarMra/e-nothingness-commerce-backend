import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import productRouter from './productRoutes.js'

const orderRouter = express.Router()

orderRouter.get('/checkoutsession/:checkoutsession', (req, res, next) => {
  Order.findOne({ checkoutId: req.params.checkoutsession })
    .then(async order => {
      if (order) {
        const ids = order.products.map(prod => {
          return prod.id
        })
        const orderProducts = await Product.find({ _id: { $in: ids } }).lean()
        const { _id, __v, ...returnedOrder } = order._doc

        for (let i = 0; orderProducts.length > i; i++) {
          for (let j = 0; returnedOrder.products.length > j; j++) {
            if (
              orderProducts[j]._id.toString() === returnedOrder.products[i].id
            ) {
              orderProducts[j].q = returnedOrder.products[i].q
            }
          }
        }
        returnedOrder.products = orderProducts

        res.send(returnedOrder)
        return
      } else {
        res.status(404).send({ err: true, message: 'Order not found' })
      }
    })
    .catch(err => next(err))
})

export default orderRouter
