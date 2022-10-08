import express from 'express'
import data from './data.js'
const port = process.env.PORT || 5000

const app = express()

app.get('/api/products', (req, res) => {
  res.send(data.products)
})

app.listen(port, () => {
  console.log(`Server on port${port}`)
})
