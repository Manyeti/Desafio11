import express from 'express'
//import multer from 'multer'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import routerProd from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import routerMessage from './routes/messages.routes.js';
import messageModel from './models/messages.models.js';
import productModel from './models/products.models.js';
//import viewRouter from './routes/view.routes.js'
import mongoose from 'mongoose';
import { __dirname } from './path.js'
import path from 'path'
import { ProductManager } from './controllers/ProductManager.js';

const PORT = 4000
const app = express()
const productManager = new ProductManager('./src/models/productos.txt');

//Server
const server = app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
})
const io = new Server(server)
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
app.engine('handlebars', engine()) // Se va a trabajar con handlebars
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views')) // ver si va el punto
//const upload = multer({ storage: storage })
//const mensajes = []

//conexion BD
mongoose.connect('mongodb+srv://sergio:coderhouse@cluster0.lkgkcby.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log("DB Conectada"))
    .catch((error) => console.log("Error en conexión a MongoDB Atlas", error))


//Conexión a Socket
io.on("connection", (socket) => {
    console.log("Conexión Con Socket.io")
    socket.on('mensaje', info => {
        //console.log(info)
        mensajes.push(info)
        io.emit('mensajes', mensajes)
    })

    socket.on('load', async () => {
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});

	socket.on('newProduct', async product => {
		await productManager.addProduct(product);
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});

    /* socket.on('mensaje', info => {
        console.log(info)
        socket.emit('respuesta', true)
    })

    socket.on('juego', (infoJuego) => {
        if(infoJuego == "poker")
            console.log("Conexión a POKER")
        else    
            console.log("Conexión a TRUCO")
    })

    socket.on('load', async () => {
		const products = await productManager.getProducts();
		socket.emit('products', products);
	});

	socket.on('newProduct', async product => {
		await productManager.addProduct(product);
		const products = await productManager.getProducts();
		socket.emit('products', products);
	}); */
})

//Routes
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/chat', express.static(path.join(__dirname, '/public'))) //path.join() es una concatenacion de una manera mas optima que con el +
//app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/api/product', routerProd)
//app.use('/', viewRouter)

//HBS

app.get('/chat', (req, res) => {
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

 


app.get('/static/realtimeproducts', (req, res) => {
	res.render('realTimeProducts', {
		rutaCSS: 'realTimeProducts',
		rutaJS: 'realTimeProducts',
	});
});


app.use('/api/carts', routerCarts)
app.use('/api/products', routerProd);
app.use('/api/messages', routerMessage);

/* app.post('/upload', upload.single('product'), (req, res) => {
    console.log(req.file)
    console.log(req.body)
    res.status(200).send("Imagen cargada")
}) */

console.log(path.join(__dirname, '/public'))

/* //Server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)    ///antes de socket.io
}) */