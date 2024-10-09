import express from "express";
const userRouter = express.Router();
import multer from "multer";

import { signup, login, updateUser, deleteUser, getUser } from "../controllers/userController.js";
import { userVerify } from "../middelware/userMiddleware.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Multer integration with express
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer setup
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } 
});

// Routes
userRouter.post('/signup', upload.single('profile'), asyncErrorHandler(signup));
userRouter.post('/login', asyncErrorHandler(login));
userRouter.put('/update-user', userVerify, upload.single('profile'), asyncErrorHandler(updateUser));
userRouter.delete('/delete-user', userVerify, asyncErrorHandler(deleteUser));
userRouter.get('/get-user', userVerify, asyncErrorHandler(getUser));

export default userRouter;

