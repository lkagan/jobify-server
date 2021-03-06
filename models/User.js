import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name'],
        trim: true,
        maxlength: 20,
        default: 'Smith',
    },
    location: {
        type: String,
        trim: true,
        maxlength: 20,
        default: 'My city'
    }
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }

    this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
})

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
}

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
}

export default mongoose.model('User', UserSchema);