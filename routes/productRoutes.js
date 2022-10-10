import express from 'express'
import mongoose from 'mongoose'

import Product from '../models/Product.js'

const productRouter = express.Router()

productRouter.get('/', (req, res) => {
  Product.find({}).then(products => {
    res.json(products)
  })

  // GET PRODUCTS BY COLLECTION
  //   let results = mongoose.connection.collection('products').find({}).toArray()
  //   results.then(products => {
  //     res.json(products)
  //   })
})

productRouter.get('/:id', (req, res, next) => {
  Product.findById(req.params.id)
    .then(prod => {
      if (prod) {
        res.json(prod)
      } else {
        res.status(404).send({ err: true, message: 'Product not found' })
      }
    })
    .catch(err => next(err))
})

productRouter.get('/slug/:slug', (req, res, next) => {
  Product.findOne({ slug: req.params.slug })
    .then(prod => {
      if (prod) {
        res.json(prod)
      } else {
        res.status(404).send({ err: true, message: 'Product not found' })
      }
    })
    .catch(err => next(err))
})
export default productRouter
