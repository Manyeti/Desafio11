import { Router } from 'express';
import cartModel from '../models/carts.models.js';
import cartsController from '../controllers/cart.controller.js';
import productModel from '../models/products.models.js';
import { authorization, passportError } from '../utils/messageErrors.js';

const routerCarts = Router();





routerCarts.get('/', cartsController.getCarts);
routerCarts.get('/:cid', cartsController.getCart);
routerCarts.post('/', cartsController.postCart);
routerCarts.post('/:cid/purchase', cartsController.purchaseCart);
routerCarts.put('/:cid/product/:pid', passportError('jwt'), authorization('user'),cartsController.putProductCart);
routerCarts.put('/:cid/products/:pid', passportError('jwt'), authorization('user'),cartsController.putQuantityCart);
routerCarts.put('/:cid', passportError('jwt'), authorization('user'),cartsController.putProductsCart);
routerCarts.delete('/:cid', passportError('jwt'), authorization('user'),cartsController.deleteCart);
routerCarts.delete('/:cid/products/:pid', passportError('jwt'), authorization('user'),cartsController.deleteProductCart);

/* routerCarts.get('/', async (req, res) => {
	const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		res.status(200).send({ resultado: 'OK', message: carts });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar cart: ${error}` });
	}
});

routerCarts.get('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'No Encontrado', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar cart: ${error}` });
	}
});


routerCarts.post('/', async (req, res) => {
	try {
		const respuesta = await cartModel.create({});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

routerCarts.put('/:cid', async (req, res) => {
	const { cid } = req.params;
	const { updateProducts } = req.body;

	try {
		const cart = await cartModel.findById(cid);
		updateProducts.forEach(prod => {
			const productExists = cart.products.find(cartProd => cartProd.id_prod == prod.id_prod);
			if (productExists) {
				productExists.quantity += prod.quantity;
			} else {
				cart.products.push(prod);
			}
		});
		await cart.save();
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'No Encontrado', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
});

routerCarts.put('/:cid/product/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		console.log(cart)
		const product = await productModel.findById(pid);
		console.log(product)

		if (!product) {
			res.status(404).send({ resultado: 'Producto No Encontrado', message: product });
			return false;
		}

		if (cart) {
			const productExists = cart.products.find(prod => prod.id == pid);
			productExists
				? productExists.quantity++
				: cart.products.push({ id_prod: product._id, quantity: 1 });
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Carrito No Encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar producto: ${error}` });
	}
});

routerCarts.put('/:cid/products/:pid', async (req, res) => {
	const { cid, pid } = req.params;
	const { quantity } = req.body;

	try {
		const cart = await cartModel.findById(cid);

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			if (productExists) {
				productExists.quantity += quantity;
			} else {
				res.status(404).send({ resultado: 'Producto No Encontrado', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Cart No Encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
});

routerCarts.delete('/:cid', async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'No Encontrado', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al vaciar el carrito: ${error}` });
	}
});

routerCarts.delete('/:cid/products/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			const productIndex = cart.products.findIndex(prod => prod.id_prod == pid);
			let deletedProduct;
			if (productIndex !== -1) {
				deletedProduct = cart.products[productIndex];
				cart.products.splice(productIndex, 1);
			} else {
				res.status(404).send({ resultado: 'Producto No Encontrado', message: cart });
				return;
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: deletedProduct });
		} else {
			res.status(404).send({ resultado: 'Carrito No Encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	}
}); */

export default routerCarts;


/* 
Se utilizaron todos estos metodos en postman

PUT
http://localhost:4000/api/carts/64ffa5c01dcbf0429b1dc98d/product/64ff85a17af16f34bf615fe6

http://localhost:4000/api/carts/64ffa5ca5b533f4ccba55b51/product/64ff85be7af16f34bf615fe8


GET
http://localhost:4000/api/carts/64ffa5c01dcbf0429b1dc98d

GET
http://localhost:4000/api/carts/

POST
http://localhost:4000/api/carts/


DELETE
http://localhost:4000/api/carts/64ffa5ca5b533f4ccba55b51/products/64ff85be7af16f34bf615fe8

DELETE
http://localhost:4000/api/carts/6503848b744a4790e7b971bb */
