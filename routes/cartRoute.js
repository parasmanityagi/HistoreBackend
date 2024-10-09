import express from 'express';


import asyncErrorHandler from '../utils/asyncErrorHandler.js';
import { userVerify } from '../middelware/userMiddleware.js';
import { addProductToCart, removeProductFromCart, getCart, deleteCart } from '../controllers/cartController.js';

const router = express.Router();

// Add product to cart
router.post('/add', userVerify, asyncErrorHandler(addProductToCart));

// Remove product from cart
router.delete('/remove/:productId', userVerify, asyncErrorHandler(removeProductFromCart));

// Get cart details for a user
router.get('/', userVerify, asyncErrorHandler(getCart));


export default router;
