import Cart from '../models/cartSchema.js';
import { successResponse, errorResponse } from '../utils/resWrapper.js';

// Add product to cart
export const addProductToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        // Create a new cart if the user doesn't have one
        cart = new Cart({
            userId,
            products: [{ productId, quantity }]
        });
    } else {
        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex !== -1) {
            // If the product exists, update the quantity
            cart.products[productIndex].quantity += quantity;
        } else {
            // Otherwise, add the new product to the cart
            cart.products.push({ productId, quantity });
        }
    }

    await cart.save();
    return successResponse(res, cart, 'Product added to cart');
};

// Remove product from cart
export const removeProductFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return errorResponse(res, 'Cart not found', 404);
    }

    // Filter out the product to be removed
    cart.products = cart.products.filter(p => p.productId.toString() !== productId);

    await cart.save();
    return successResponse(res, cart, 'Product removed from cart');
};

// Get cart for a user
export const getCart = async (req, res) => {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
        return errorResponse(res, 'Cart not found', 404);
    }

    return successResponse(res, cart, 'Cart fetched successfully');
};



// delete cart
export const deleteCart = async (userId) => {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
        console.log('Cart not found'); 
    }
    console.log('Cart Deleted successfully');
};

