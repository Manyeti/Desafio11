import 'dotenv/config'
import express from 'express'
//import multer from 'multer'
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


const PORT = 4000
const app = express()


//Server
/* const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server) */

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("DB conectada")
    })
    .catch((error) => {
        console.log(error)
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
app.use(express.json())
app.use(express.urlencoded({ extended: true })) //URL extensas
app.use(cookieParser(process.env.SIGNED_COOKIE)) //Firmo la cookie
app.engine('handlebars', engine()) // Se va a trabajar con handlebars
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views')) // ver si va el punto
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
app.use((req, res, next) => {
    if (req.session.user) {
        const user = req.session.user;
        res.locals.welcomeMessage = `Welcome, ${user.first_name} ${user.last_name}!`;
    }
    next();
});

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

function auth(req, res, next) {
    console.log(req.session.email)

    if (req.session.email == "manyeti73@gmail.com" && req.session.password == "Lisa") {
        return next() //Continua con la ejecucion normal de la ruta
    }

    return res.send("No tenes acceso a este contenido")
}


//conexion BD
/* mongoose.connect(process.env.MONGO_URL)
    .then(async() => {
        console.log("DB Conectada")
        //await cartModel.create({})
    })
    .catch((error) => console.log("Error en conexión a MongoDB Atlas", error))
 */

//Conexión a Socket
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
//app.use('/', viewRouter)
app.use('/api/messages', routerMessage);
app.use('/api/products', productRouter)
app.use('/api/carts', routerCarts)
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter)

//Cookies

app.get('/setCookie', (req, res) => {
    res.cookie('CookieCookie', 'Esto es el valor de una cookie', { maxAge: 60000, signed: true }).send('Cookie creada') //Cookie de un minuto firmada
})

app.get('/getCookie', (req, res) => {
    res.send(req.signedCookies) //Consultar solo las cookies firmadas
    //res.send(req.cookies) Consultar TODAS las cookies
})

//SESSIONS

app.get('/session', (req, res) => {
    if (req.session.counter) { //Si existe la variable counter en la asesion
        req.session.counter++
        res.send(`Has entrado ${req.session.counter} veces a mi pagina`)
    } else {
        req.session.counter = 1
        res.send("Hola, por primera vez")
    }
})

app.get('/login', (req, res) => {
    const { email, password } = req.body


    req.session.email = email
    req.session.password = password

    return res.send("Usuario logueado")

})

app.get('/admin', auth, (req, res) => {
    res.send("Sos admin")
})

app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error)
            console.log(error)
        else
            res.redirect('/')
    })
})


//HBS
/* app.get('/chat', (req, res) => {
	res.render('chat', {
        rutaJS: 'chat',
        rutaCSS: "style"
    });    
})


app.get('/static', (req, res) => {
	 res.render('home', {
		rutaCSS: 'home',
		rutaJS: 'home',
	});
});

app.get('/static/register', async (req, res) => {

    res.render('register', {
        pathJS: 'register',
        pathCSS: 'register'
    })
})

app.get('/static/login', async (req, res) => {
    res.render('login', {
        pathJS: 'login',
        pathCSS: 'login'
    })
}) 


app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});

app.get('/static/carts/:cid', (req, res) => {
	res.render('carts', {
		rutaCSS: 'carts',
		rutaJS: 'carts',
	});
}); */




/* app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
}) */

//console.log(path.join(__dirname, '/public'))

//Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)    ///antes de socket.io
})