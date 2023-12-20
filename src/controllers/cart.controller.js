import cartModel from '../models/carts.models.js';
import userModel from '../models/user.models.js';
import productModel from '../models/products.models.js';

const purchaseCart = async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		const products = await productModel.find();

		if (cart) {
			const user = await userModel.find({ cart: cart._id });
			const email = user[0].email;
			let amount = 0;
			const purchaseItems = [];
			cart.products.forEach(async item => {
				const product = products.find(prod => prod._id == item.id_prod.toString());
				if (product.stock >= item.quantity) {
					amount += product.price * item.quantity;
					product.stock -= item.quantity;
					await product.save();
					purchaseItems.push(product.title);
				}
			});
			if (user.rol === 'premium') {
				amount *= 0.9;
			}
			console.log(purchaseItems);
			await cartModel.findByIdAndUpdate(cid, { products: [] });
			res.redirect(
				`http://localhost:4000/api/tickets/create?amount=${amount}&email=${email}`
			);
		} else {
			res.status(404).send({ resultado: 'Carro No Encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carro: ${error}` });
	}
};

const postCart = async (req, res) => {
    const { id_prod, quantity } = req.body
	try {
		const crearCarrito = await cartModel.create({
			id_prod, quantity
		})
		res.status(200).send({ resultado: 'OK', message: crearCarrito })
	} catch (error) {
		res.status(400).send({ error: `Error al crear carro:  ${error}` })
	}
}

const putProductsCart = async (req, res) => {
	
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
			: res.status(404).send({ resultado: 'Carro no Encontrado', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
};

const putProductCart = async (req, res) => {
	// agregar varios producto al carrito
	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		const product = await productModel.findById(pid);

		if (!product) {
			res.status(404).send({ resultado: 'Producto No Encontrado', message: product });
			return false;
		}

		if (product.stock === 0) {
			console.log(product.stock);
			res.status(400).send({ error: `No hay stock` });
		}

		if (cart) {
			const productExists = cart.products.find(prod => prod.id_prod == pid);
			if (!productExists) {
				cart.products.push({ id_prod: product._id, quantity: 1 });
			} else if (productExists.quantity < product.stock) {
				productExists.quantity++;
			} else {
				return res.status(400).send({ error: `No hay stock suficiente` });
			}
			await cart.save();
			res.status(200).send({ resultado: 'OK', message: cart });
		} else {
			res.status(404).send({ resultado: 'Carro No Encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
};

const putQuantityCart = async (req, res) => {
	const { cid, pid } = req.params
	const { quantity } = req.body
	const product = await productModel.findById(pid);

	if (product.stock < productExists.quantity + quantity) {
		res.status(400).send({ error: `No hay stock suficiente` });
	}
	try {
		const cart = await cartModel.findById(cid)
		if (cart) {
			const prod = cart.products.find(prod => prod.id_prod == pid)
			if (prod) {
				prod.quantity = quantity
			} else {
				res.status(404).send({ resultado: 'Producto No Encontrado', message: cart });
				return;
			}	
			await cart.save();
			res.status(200).send({ respuesta: 'OK', mensaje: `Cantidad Actualizada` })
		} else {
			res.status(404).send({ resultado: 'Carro No Encontrado', message: error });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` })
	}
}


const getCart = async (req, res) => {
	const { cid } = req.params;
	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			res.status(200).send({ resultado: 'OK', message: cart })
		} else {
			res.status(404).send({ resultado: 'Carro No Encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al consultar carro: ${error}` });
	}
}


const getCarts = async (req, res) => {
    const { limit } = req.query;
	try {
		const carts = await cartModel.find().limit(limit);
		if (carts) {
			res.status(200).send({ resultado: 'OK', message: carts });
		} else {
			res.status(404).send({ resultado: 'Carritos no encontrados' });
		}
	} catch (error) {
		res.status(500).send({ error: `Error al consultar carritos: ${error}` });
	}
};

const deleteProductCart = async (req, res) => {
    const { cid, pid } = req.params
	try {
		const cart = await cartModel.findById(cid)
		if (cart) {
			const indice = cart.products.findIndex(prod => prod.id_prod == pid)
			if (indice != -1) {
				cart.products.splice(indice, 1)
				cart.save()
				res.status(200).send({ respuesta: 'OK', mensaje: `El Producto id: ${pid} del carro id: ${cid} fue eliminado` })
			} else {
				res.status(404).send({ resultado: 'Producto No Encontrado', message: cart });
			}
		} else {
			res.status(404).send({ resultado: 'Carro No Encontrado', message: error });
		}
	} catch (error) {
		res.status(400).send({ error: error })
	}
}

const deleteCart = async (req, res) => {
    const { cid } = req.params;
	try {
		const cart = await cartModel.findByIdAndUpdate(cid, { products: [] });
		if (cart) {
			res.status(200).send({ resultado: 'OK', message: cart })
		} else {
			res.status(404).send({ resultado: 'Carro No Encontrado', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al vaciar el carro: ${error}` });
	}
}

const cartsController = {
	getCarts,
	getCart,
	purchaseCart,
	postCart,
	putProductsCart,
	putProductCart,
	putQuantityCart,
	deleteCart,
	deleteProductCart,
};

export default cartsController;