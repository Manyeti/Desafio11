import {Schema, model} from 'mongoose';
import cartModel from './carts.models.js'

const fileSchema = new Schema(
	{
		name: String,
		reference: String,
	},
	{ _id: false }
);

const userSchema = new Schema ({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    rol: {
		type: String,
		default: 'user',
	},
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    documents: [fileSchema],
	last_connection: Date,
})


userSchema.pre('save', async function (next) {

    try {
        const newCart = await cartModel.create({})
        this.cart = newCart._id
    } catch (error) {
        next(error)
    }

})
const userModel = model('user', userSchema);

export default userModel;

//export const userModel = model('users', userSchema) // efino modelo con nombre