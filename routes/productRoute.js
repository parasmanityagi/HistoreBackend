import express from "express";
const productRouter = express.Router();

import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import { getAllProducts } from "../controllers/productController.js";


productRouter.get('/get-all-products', asyncErrorHandler(getAllProducts));

export default productRouter;
