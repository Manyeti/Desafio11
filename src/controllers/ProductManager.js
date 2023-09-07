import {promises as fs} from 'fs'


export class ProductManager {
    constructor(path){
        this.path = path;
        this.products = [];
    }

    static id = 0;


    /* addProduct = async (title, description, price, thumbnail, code, stock) => {
        ProductManager.id++;
        const newProduct = {
            title, description, price, thumbnail, code, stock, id: ProductManager.id
        };
        this.products.push(newProduct)
        await fs.writeFile(this.path, JSON.stringify(this.products));  */

        addProduct = async (product) =>{
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        const existProd = prods.find(producto => producto.code === product.code)

        if (existProd) { //Indico que el producto ya existe
            return false
        } else {
        if (prods.length === 0) {
            product.id = 1;
        } else {
            product.id = prods[prods.length - 1].id + 1;
        }
            product.status = true;
            prods.push(product)
            await fs.writeFile(this.path, JSON.stringify(prods))
            return true
        }
    }


    leerProductos = async () => {
        const leeProducts = JSON.parse(await fs.readFile(this.path, "utf-8")); // metodo para acortar el codigo referente a la lectura de los productos
        return leeProducts
    }  


    getProducts = async () => {
        const products = await this.leerProductos();
        //console.log(products); // para mostrar por consola
        return products; // para mostrar en ruta por pantalla
    }


    getProductById = async (id) => {
        const products = await this.leerProductos();
        const prod = products.find(producto => producto.id === id)
        if (prod) {
            console.log(prod);
            return prod
        }else {
            console.log("Producto no encontrado");
        }    
    }

    updateProduct = async (id, {title, description, price, thumbnail, code, stock, status}) => {
        const products = await this.leerProductos();
        const indice = products.findIndex(prod => prod.id === id);
        if (indice != -1) {
            products[indice].title = title
            products[indice].description = description
            products[indice].price = price
            products[indice].thumbnail = thumbnail
            products[indice].code = code
            products[indice].stock = stock
            products[indice].status = status
            await fs.writeFile(this.path, JSON.stringify(products));
            return(products);
        } else {
            console.log("Producto no encontrado");
        }
    } 


    deleteProduct = async (id) => {
        const products = await this.leerProductos();
        const prods = products.filter(prod => prod.id !=id);
        await fs.writeFile(this.path, JSON.stringify(prods));
        console.log("Se ha eliminado el producto");
    }

}     

/* async function generador()   {  
const productos = new ProductManager("productos.json")

}

generador() */
//productos.addProduct("Titulo Principal", "Descripcion Principal", 800, "Foto Principal", "LIB123", 23);   //Acá agreamos estos productos
//productos.addProduct("Titulo Principal2", "Descripcion Principal2", 1000, "Foto Principal2", "LIB1234", 25);  
//productos.addProduct("Titulo Principal9", "Descripcion Principal3", 1600, "Foto Principal3", "LIB12345", 16, true);


export class Product {
    constructor(title, description, price, thumbnail, code, stock, status) {
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock  
        this.status = status
    }
    async cargar () {
        
        await probando.addProduct(product1)
        timer:500
        const product2 = new Product("Nuevo titulo final", "nuevo titulo", 800, "sin foto aun", "LIB555643", 20, true)
        await probando.addProduct(product2)
        timer:500
    }
}

const probando = new ProductManager('src/models/productos.txt')
//const product1 = new Product("Nuevo titulopro2", "nuevo tituloPro2", 152300, "sin foto aun", "LIB3488444", 16, true)
//product1.cargar()

//probando.getProducts() // traer los productos
//probando.getProductById(2) //  traer los productos por ID
//probando.deleteProduct(18)  //  Eliminar productos por ID
//probando.updateProduct(17, {title: "Titulo Secundario actualizado", description: "Descripcion actualizado", price: 750, thumbnail:"Foto Secundario", code: "LIB88887", stock:31, status:true})// Actualizar por ID

