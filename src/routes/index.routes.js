import { Router } from "express";
import routerCarts from "./carts.routes.js";
import routerProd from "./products.routes.js";
import sessionRouter from "./session.routes.js";
import userRouter from "./user.routes.js";
import routerMessage from './messages.routes.js';
import routerHandlebars from './handlebars.routes.js';
import routerTicket from './tickets.routes.js';

const router = Router()

router.use('/api/product', routerProd)
router.use('/api/user', userRouter)
router.use('/api/carts', routerCarts)
router.use('/api/sessions', sessionRouter)
router.use('/api/messages', routerMessage);
router.use('/static', routerHandlebars);
router.use('/api/tickets', routerTicket);

export default router