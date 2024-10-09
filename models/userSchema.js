import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    profile:{
        type:String,
        required:true
    },
    // address: {
    //     type: String,
    //     required: true,
    // },
    // pincode: {
    //     type: Number,
    //     required: true,
    // },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isMobileVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User
