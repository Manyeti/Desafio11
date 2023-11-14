import { Router } from "express";
import routerCarts from "./carts.routes.js";
import routerProd from "./products.routes.js";
import sessionRouter from "./session.routes.js";
import userRouter from "./user.routes.js";
import routerMessage from './messages.routes.js';
import routerHandlebars from './handlebars.routes.js';
import routerTicket from './tickets.routes.js';
import routerMailing from './mail.routes.js';
import routerMock from './mocks.routes.js';
import logger from '../utils/logger.js';

const router = Router()

router.use('/api/product', routerProd)
router.use('/api/user', userRouter)
router.use('/api/carts', routerCarts)
router.use('/api/sessions', sessionRouter)
router.use('/api/messages', routerMessage);
router.use('/static', routerHandlebars);
router.use('/api/tickets', routerTicket);
router.use('/api/mail', routerMailing);
router.use('/api/mockingproducts', routerMock);
router.get('/loggerTest', (req, res) => {
	logger.debug('Debes proceder a debbugear');
	logger.info('Acá hay mayor información');
	logger.warning(
		`[WARNING][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] Alerta: Algo puede estar mal`
	);
	logger.error(
		`[ERROR][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] Error: Algo esta mal`
	);
	logger.fatal(
		`[ERROR FATAL][${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}] Error Fatal: Algo esta muy mal`
	);

	res.status(200).send('Prueba concluida con exito!!');
});

export default router