import { Router } from 'express'
import { ProductManager } from '../controllers/ProductManager.js'

const productManager = new ProductManager('src/models/productos.txt')

const routerProd = Router()

routerProd.get('/', async (req, res) => {
    const { limit } = req.query

    const prods = await productManager.getProducts()
    const products = prods.slice(0, limit)
    res.status(200).send(products)

})

routerProd.get('/:id', async (req, res) => {
    const { id } = req.params
    const prod = await productManager.getProductById(parseInt(id))

    if (prod)
        res.status(200).send(prod)
    else
        res.status(404).send("Producto no existente")
})

routerProd.post('/', async (req, res) => {
	const { title, description, stock, code, price, category } = req.body;

	try {
		const respuesta = await productModel.create({
			title,
			description,
			category,
			stock,
			code,
			price,
		});
		res.status(200).send({ resultado: 'OK', message: respuesta });
	} catch (error) {
		res.status(400).send({ error: `Error al crear producto: ${error}` });
	}
});

routerProd.put('/:pid', async (req, res) => {
	const { pid } = req.params;
	const { title, description, stock, code, price, category, status } = req.body;
	try {
		const prod = await productModel.findByIdAndUpdate(pid, {
			title,
			description,
			category,
			stock,
			code,
			price,
		});
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al actualizar producto: ${error}` });
	}
});

routerProd.delete('/:pid', async (req, res) => {
	const { pid } = req.params;
	try {
		const prod = await productModel.findByIdAndDelete(pid);
		prod
			? res.status(200).send({ resultado: 'OK', message: prod })
			: res.status(404).send({ resultado: 'Not Found', message: prod });
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	}
});

export default routerProd