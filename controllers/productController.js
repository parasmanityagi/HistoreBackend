import mongoose from 'mongoose';


import Products from '../models/productSchema.js';
import { errorResponse, successResponse } from '../utils/resWrapper.js';

// Get all products controller
const getAllProducts = async (req, res) => {
    const products = await Products.find({});
    if (!products) {
        return errorResponse(res, 'No products found', 404);
    }
    successResponse(res, products, 'Products retrieved successfully', 200);
};


export { getAllProducts };
