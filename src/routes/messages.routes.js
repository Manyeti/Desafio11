import { Router } from 'express';
import messagesController from '../controllers/message.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';

const routerMessage = Router();


routerMessage.get('/', messagesController.getMessage);

routerMessage.post('/', passportError('jwt'), authorization('user'), messagesController.postMessage);

/* routerMessage.get('/', async (req, res) => {
	try {
		const messages = await messageModel.find();
		res.status(200).send({ resultado: 'OK', message: messages });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar mensajes: ${error}` });
	}
});

routerMessage.post('/', async (req, res) => {
	const { email, message } = req.body;
    try {
		const respuesta = await messageModel.create({
			email,
			message,
		});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
}); */

export default routerMessage;
