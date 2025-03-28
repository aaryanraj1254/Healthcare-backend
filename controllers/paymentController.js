const stripe = require('../config/stripe');
const Payment = require('../models/paymentModel');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      metadata: { appointmentId }
    });

    await Payment.create({
      appointmentId,
      amount,
      stripePaymentId: paymentIntent.id
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update payment status in DB
    Payment.updateOne(
      { stripePaymentId: paymentIntent.id },
      { status: 'succeeded' }
    ).exec();
  }

  res.json({ received: true });
};