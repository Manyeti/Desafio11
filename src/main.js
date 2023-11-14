import 'dotenv/config'
import express from 'express'
//import multer from 'multer'
import router from './routes/index.routes.js'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars' 
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productRouter from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import sessionRouter from './routes/session.routes.js';
import userRouter from './routes/user.routes.js';
import routerMessage from './routes/messages.routes.js';
import messageModel from './models/messages.models.js';
import productModel from './models/products.models.js';
import passport from 'passport';
//import viewRouter from './routes/view.routes.js'
import mongoose from 'mongoose';
import { __dirname } from './path.js'
import path from 'path'
import { ProductManager } from './controllers/ProductManager.js';
import cartModel from './models/carts.models.js'
import cookieParser from 'cookie-parser'
import initializePassport from './config/passport.js'
import config from "./config/config.js";
import routerHandlebars from './routes/handlebars.routes.js';
//import { addLogger } from './utils/logger.js';
import logger from './utils/logger.js';

console.log(config)

const PORT = 4000
const app = express()


//Server
/*  const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
  
}) */

 const server = app.listen(PORT, () => {
    logger.info(`Server on port ${PORT}`)
  
}) 
const io = new Server(server) 

/* mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB conectada")
    })
    .catch((error) => {
        console.log(error)
    }) */

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        logger.info("DB conectada")
    })
    .catch((error) => {
        logger.fatal(error)
    })	

//Config

/* const storage = multer.diskStorage({
    destination: (req, file, cb) => { //cb => callback
        cb(null, 'src/public/img') //el null hace referencia a que no envie errores
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`) //concateno la fecha actual en ms con el nombre del archivo
        //1232312414heladera-samsung-sv
    }
}) */

//Middlewares

function auth(req, res, next) {
    console.log(req.session.email)

    if (req.session.email === "lisa@lisa.com") // && req.session.password == "Lisa") 
    {
        return next() //Continua con la ejecucion normal de la ruta
    }

    return res.send("No tenes acceso a este contenido")
}

app.use(express.json())
app.use(express.urlencoded({ extended: true })) //URL extensas
//app.use(addLogger);
//app.use(cookieParser(process.env.JWT_SECRET)) //Firmo la cookie
app.use(cookieParser(process.env.SIGNED_COOKIE)); // firmo la cookie para que si se modifica la cookie no la acepte
//app.engine('handlebars', engine()) // Se va a trabajar con handlebars
//app.set('view engine', 'handlebars')
//app.set('views', path.resolve(__dirname, './views')) // ver si va el punto
//const upload = multer({ storage: storage })
//const mensajes = []
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        ttl: 60 // tiempo de duracion de la sesion.
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
/* app.use((req, res, next) => {
    if (req.session.user) {
        const user = req.session.user;
        res.locals.welcomeMessage = `Welcome, ${user.first_name} ${user.last_name}!`;
    }
    next();
}); */

app.engine('handlebars', engine()); //defino que mi motor de plantillas va a ser handlebars
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));


//Passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())




//conexion BD
/* mongoose.connect(process.env.MONGO_URL)
    .then(async() => {
        console.log("DB Conectada")
        //await cartModel.create({})
    })
    .catch((error) => console.log("Error en conexión a MongoDB Atlas", error))
 */

//Conexión a Socket

io.on('connection', socket => {
	logger.info('Conexión con Socket.io');

	socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 5 });
		socket.emit('products', data);
	});

	socket.on('loadCart', async () => {
		const cart = await cartModel.findById(cartId).populate('products.id_prod');
		if (cart) {
			socket.emit('cartProducts', { products: cart.products, cid: cartId });
		} else {
			socket.emit('cartProducts', false);
		}
	});

	socket.on('newProduct', async product => {
		await productModel.create(product);
		const products = await productModel.find();

		socket.emit('products', products);
	});

	socket.on('mensaje', async info => {
		const { email, message } = info;
		await messageModel.create({
			email,
			message,
		});
		const messages = await messageModel.find();

		socket.emit('mensajes', messages);
	});
});

/* io.on("connection", (socket) => {
    console.log("Conexión Con Socket.io")
    socket.on('mensaje', info => {
        //console.log(info)
        mensajes.push(info)
        io.emit('mensajes', mensajes)
    })

    socket.on('load', async () => {
		const data = await productModel.paginate({}, { limit: 7 });
		console.log(data);
		socket.emit('products', data);
	});

	socket.on('previousPage', async page => {
		const data = await productModel.paginate({}, { limit: 6, page: page });
		socket.emit('products', data);
	});

	socket.on('nextPage', async page => {
		const data = await productModel.paginate({}, { limit: 4, page: page });
		socket.emit('products', data);
	});



    socket.on('newProduct', async product => {
		await productModel.create(product);
		const products = await productModel.find();

		socket.emit('products', products);
	});

    socket.on('mensaje', async info => {
		const { email, message } = info;
		await messageModel.create({
			email,
			message,
		});
		const messages = await messageModel.find();

		socket.emit('mensajes', messages);
	});

    socket.on('addProduct', async data => {
		const { pid, cartId } = data;
		if (cartId) {
			const cart = await cartModel.findById(cartId);
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			productExists
				? productExists.quantity++
				: cart.products.push({ id_prod: pid, quantity: 1 });
			await cart.save();
			socket.emit('success', cartId);
		} else {
			const cart = await cartModel.create({});
			cart.products.push({ id_prod: pid, quantity: 1 });
			await cart.save();
			socket.emit('success', cart._id.toString());
		}
	});

    
}) */

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +
//app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/RealTimeProduct', productRouter)
app.use('/static', routerHandlebars);
//app.use('/', viewRouter)
app.use('/api/messages', routerMessage);
/* app.use('/api/products', productRouter)
app.use('/api/carts', routerCarts)
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter) */
app.use('/', router)
//Cookies