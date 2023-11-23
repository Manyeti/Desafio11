import { Router } from "express";
import userModel from '../models/user.models.js'
import { createHash } from "../utils/bcrypt.js";
import passport from "passport";
import usersController from '../controllers/user.controller.js';

//const userRouter = Router({caseSensitive: false});
const userRouter = Router()

userRouter.post('/', passport.authenticate('register'), usersController.postUser);

userRouter.get('/', usersController.getUser);

userRouter.post('/recovery', usersController.recoveryPassword);

userRouter.post('/resetpassword/:token', usersController.resetPassword);

// Get users
/* userRouter.get('/', async (req, res) => {
	try {
		const users = await userModel.find()

		if(users) {
			res.status(200).send({status: 'success', users: users})
		} else {
			res.status(404).send({status: 'error', message: 'Not found'})
		}
	} catch (error) {
		res.status(500).send({Error: `Internal server error: ${error}`})
	}
}) */


/*
const { first_name, last_name, email, password, age } = req.body
    console.log(password)
    try {
        const hashPassword = createHash(password)
        const response = await userModel.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashPassword,
            age: age
        })
        res.status(200).send({ mensaje: 'Usuario creado', respuesta: response })
    } catch (error) {
        res.status(400).send({ error: `Error en create user: ${error}` })
    }

*/
/* userRouter.post('/', passport.authenticate('register'), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: 'Usuario ya existente' })
        }
        return res.status(200).send({ mensaje: 'Usuario creado' })
    } catch (error) {
        res.status(500).send({ mensaje: `Error al crear usuario ${error}` })
    }
}) */

export default userRouter