import express from 'express'
import Product from '../models/Product.js'

const productRouter = express.Router()

productRouter.get('/', async (req, res) => {
  Product.find().then(products => {
    res.json(products)
  })
})

productRouter.get('/:id', async (req, res, next) => {
  Product.findById(req.params.id)
    .then(prod => {
      if (prod) {
        res.json(prod)
      } else {
        res.status(404).end()
      }
    })
    .catch(err => next(err))
})

export default productRouter
