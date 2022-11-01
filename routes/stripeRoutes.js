import express from 'express'
import dotenv from 'dotenv'
import Stripe from 'stripe'
import Order from '../models/Order.js'

dotenv.config()

const stripe = Stripe(process.env.STRIPE_KEY)
const stripeRouter = express.Router()

const clientUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.PROD_CLIENT_URL
    : process.env.DEV_CLIENT_URL

stripeRouter.post('/create-checkout-session', async (req, res) => {
  const items = req.body.items.map(item => {
    return {
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            productId: item.id,
            slug: item.id,
          },
        },
        unit_amount: item.price,
      },
      quantity: item.q,
    }
  })
  const productIds = {
    ...req.body.items.map(item => {
      return item.id
    }),
  }
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userInfo.id,
      cart: JSON.stringify(req.body.cartItems),
    },
  })

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    metadata: productIds,
    customer: customer.id,
    mode: 'payment',
    success_url: `${clientUrl}checkout_success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}cart?checkout_cancel=true`,
  })
  res.send({ url: session.url })
})

//Stripe webhook: checkout succeed
const endpointSecret =
  process.env.NODE_ENV === 'production'
    ? process.env.STRIPE_WEBHOOK_SECRET_PROD
    : process.env.STRIPE_WEBHOOK_SECRET_DEV

function createOrder(data, customer, items) {
  function reducer(data, prop) {
    const sum = data.reduce((accumulator, object) => {
      return accumulator + object[prop]
    }, 0)
    return sum
  }
  const metadata = data.metadata
  const products = items.map((item, index) => {
    return { id: metadata[index], q: item.quantity }
  })
  console.log(products)

  const newOrder = new Order({
    userId: customer.metadata.userId,
    customerId: customer.id,
    checkoutId: data.id,
    products,
    subtotal: reducer(items, 'amount_subtotal'),
    total: reducer(items, 'amount_total'),
    payment_status: data.payment_status,
    totalQ: reducer(items, 'quantity'),
  })
  console.log(newOrder)
  newOrder
    .save()
    .then(order => {
      console.log('Registered order:' + order)
      return
    })
    .catch(err => console.log(err))
}

stripeRouter.post(
  '/webhook',
  express.json({ type: 'application/json' }),
  (request, response) => {
    const sig = request.headers['stripe-signature']
    console.log('fffff', sig)
    let event

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const data = event.data.object
        stripe.customers.retrieve(data.customer).then(async customer => {
          try {
            const lineItems = await stripe.checkout.sessions.listLineItems(
              data.id,
            )

            createOrder(data, customer, lineItems.data)
          } catch (err) {
            console.log(typeof createOrder)
            console.log(err)
          }
        })
        // Then define and call a function to handle the event payment_intent.succeeded
        break
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    // Return a 200 response to acknowledge receipt of the event
    response.status(200).send()
  },
)

export default stripeRouter
