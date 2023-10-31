import userModel from '../models/user.models.js'
import passport from "passport";

const getUser = async (req, res) => {
	try {
		const users = await userModel.find()
			res.status(200).send(users)
		
    } catch (error) {
            return res.status(400).send({ error: `Error en consultar Usuario ${error}` })

    }
}

const postUser = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).send({ mensaje: 'Usuario existente' });
		}
		res.status(200).send({ mensaje: 'Usuario creado' });
		//return res.redirect('../../static/home');
	} catch (error) {
		res.status(500).send({ mensaje: `Error al crear el usuario ${error}` });
	}
}

const usersController = { 
	getUser, 
	postUser 
};

export default usersController;