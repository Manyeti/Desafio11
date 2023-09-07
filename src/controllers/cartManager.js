
import { promises as fs } from 'fs'

export class CartManager {
    constructor(path) {
        this.cart = []
        this.path = path
    }

    async agregarCarrito() {
        this.cart = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const nuevoCart = {}
        if (this.cart.length === 0) {
            nuevoCart.id = 1;
        } else {
            nuevoCart.id = this.cart[this.cart.length - 1].id + 1;
        }
        nuevoCart.products = []
        this.cart.push(nuevoCart)
        await fs.writeFile(this.path, JSON.stringify(this.cart))
    }

    async getProductByCart(cid) {

        this.cart = JSON.parse(await fs.readFile(this.path, 'utf-8'));
        const buscado = this.cart.find(carts => carts.id === parseInt(cid))
        if (buscado) {
            return buscado
        } else {
            return false
        }
    }

    async addProdCart(cid, pid) {
        const prods = JSON.parse(await fs.readFile('src/models/productos.txt', 'utf-8'))
        const agregarProd = prods.find(producto => producto.id === parseInt(pid))
        this.cart = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existeCarrito = this.cart.find(carts => carts.id === parseInt(cid))

        if (!agregarProd) {
            return false
        } else {
            if (!existeCarrito) {
                return false
            } else {
                const existeProducto = existeCarrito.products.find(products => products.id === parseInt(pid))
                if (existeProducto) {
                    existeProducto.cantidad++
                } else {
                    const nuevoProducto = {}
                    nuevoProducto.cantidad = 1
                    nuevoProducto.id = agregarProd.id
                    existeCarrito.products.push(nuevoProducto)
                }
                await fs.writeFile(this.path, JSON.stringify(this.cart))
                return true
            }

        }

    }
}


const probando = new CartManager('src/models/carrito.txt')
//probando.agregarCarrito() // agrega nuevo carrito vacio
//probando.addProdCart(5, 11)  // agrega al carrito 5 una cantidad del producto 11
//probando.addProdCart(4, 7) // al ejecutarlo 2 veces agrega al carrito 4, la cantidad 2 del producto 7
//probando.getProductByCart(4)  // trae el carrito 4 con sus respectivos prodcutos
