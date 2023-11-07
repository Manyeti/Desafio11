import { Router } from 'express'
import productsController from '../controllers/product.controller.js';
import { authorization, passportError } from '../utils/messageErrors.js';
import createProducts from '../controllers/mocks.controller.js';

const routerProd = Router()

/* routerProd.get('/', async (req, res) => {
	const { limit, page, sort, category, status } = req.query;
	let sortOption;
	sort == 'asc' && (sortOption = 'price');
	sort == 'desc' && (sortOption = '-price');

	const options = {
		limit: limit || 10,
		page: page || 1,
		sort: sortOption || null,
	};

	const query = {};
	category && (query.category = category);
	status && (query.status = status);

	try {
		const prods = await productModel.paginate(query, options);
		res.status(200).send({ resultado: 'OK', message: prods });
	} catch (error) {
		res.status(400).send({ error: `Error al consultar productos: ${error}` });
	}
}); */

routerProd.get('/', productsController.getProducts);
routerProd.get('/:pid', productsController.getProduct);
routerProd.post('/', passportError('jwt'), authorization('admin'), productsController.postProduct);
routerProd.put('/:pid', passportError('jwt'), authorization('admin'), productsController.putProduct);
routerProd.delete('/:pid', passportError('jwt'), authorization('admin'),productsController.deleteProduct);



/* routerProd.get('/', async (req, res) => {
    const { limit } = req.query
    try {
        const prods = await productModel.find().limit(limit)
        res.status(200).send({ resultado: 'OK', message: prods })
    } catch (error) {
        res.status(400).send({ error: `Error al consultar productos: ${error}` })
    }
})

routerProd.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const prod = await productModel.findById(id)
        if (prod)
            res.status(200).send({ resultado: 'OK', message: prod })
        else
            res.status(404).send({ resultado: 'Not Found', message: prod })
    } catch (error) {
        res.status(400).send({ error: `Error al consultar producto: ${error}` })
    }
})

routerProd.post('/',passportError('jwt'), authorization('Admin'), async (req, res) => {
    const { title, description, stock, code, price, category } = req.body

    try {
        const respuesta = await productModel.create({
            title, description, stock, code, price, category
        })

        res.status(200).send({ resultado: 'OK', message: respuesta })
    } catch (error) {
        res.status(400).send({ error: `Error al crear producto: ${error}` })
    }
})

routerProd.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, stock, code, price, category, status } = req.body
    try {
        const respuesta = await productModel.findByIdAndUpdate(id, { title, description, stock, code, price, category, status })
        if (prod)
            res.status(200).send({ resultado: 'OK', message: respuesta })
        else
            res.status(404).send({ resultado: 'Not Found', message: respuesta })
    } catch (error) {
        res.status(400).send({ error: `Error al actualizar producto: ${error}` })
    }
})

routerProd.delete('/:id', async (req, res) => {
    const { id } = req.params

    try {
        const respuesta = await productModel.findByIdAndDelete(id)
        if (prod)
            res.status(200).send({ resultado: 'OK', message: respuesta })
        else
            res.status(404).send({ resultado: 'Not Found', message: respuesta })
    } catch (error) {
        res.status(400).send({ error: `Error al eliminar producto: ${error}` })
    }
}) */

export default routerProd

/* 
GET
http://localhost:4000/api/products/
Lista productos con Limite y muestra la información solicitada sobre las paginas 

http://localhost:4000/api/products?limit=4
http://localhost:4000/api/products?limit=4&sort='desc'
http://localhost:4000/api/products?limit=4&page=2&sort='desc'

*/