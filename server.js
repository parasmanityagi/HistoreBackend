import express from 'express';
import { config as configDotenv } from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';
import Stripe from 'stripe';


import connectDB from './database/db.js';
import userRouter from './routes/userRoute.js'; 
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import swaggerSpec from './swagger/swaggerConfig.js';

const app = express();


// stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// import uploadProducts from './utils/data.js';
// uploadProducts()

// Load environment variables from .env file
configDotenv();

// Connect to the database
connectDB();



// Middleware to parse JSON
app.use(express.json());
app.use(bodyParser.json())
app.use(cors());
// app.use(compression())
app.use('/api/user/image', express.static('uploads'))
app.use('/api/products/image', express.static('assets'))

// Route handling
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);


// Stripe payment endpoint
app.post('/api/payment', async (req, res) => {
    const { amount, currency, source } = req.body;

    if (!amount || !currency || !source) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: source,
            confirm: true,
        });

        res.status(200).json({ success: true, paymentIntent });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// home route
app.get('/', (req, res) => {
    res.status(200).send('Welcome To Server!! Server is Running Well.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


