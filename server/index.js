
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_51QX3hnH8tTyPMHrp0AoWBvI5pl0LZpe37A5rrAoim4caXGmOplAWMZmGHNEfWqPKvdzygyqQoMta8gKNp1GX73eR00hJdP6wLj'); 


app.use(cors());
app.use(express.json());


app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.json({ paymentIntent: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ error: 'Failed to create payment intent' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
