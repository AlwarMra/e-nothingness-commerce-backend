import express from 'express'
import dotenv from 'dotenv'
import Stripe from 'stripe'

dotenv.config()

const stripe = Stripe(
  'sk_test_51LsSqiKkxdHzWXvLBGUfSVpJzir5Ynbeec6TviXn6GGhvNNUlcdDhoqhQejiUA5kdVmXYfsQL8QPkTUR0evnWy8y009wSbubCu',
)
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
            id: item.id,
          },
        },
        unit_amount: item.price,
      },
      quantity: item.q,
    }
  })
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userInfo.id,
      cart: JSON.stringify(req.body.cartItems),
    },
  })

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    customer: customer.id,
    mode: 'payment',
    success_url: `${clientUrl}checkout_success/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}checkout_cancel`,
  })
  console.log(session)
  res.send({ url: session.url })
})

export default stripeRouter
