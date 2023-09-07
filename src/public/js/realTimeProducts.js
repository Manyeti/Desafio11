const socket = io()

//const form = document.getElementById('formProduct')
const form = document.querySelector('#formProduct');
const productsContainer = document.querySelector('#productos');

socket.emit('load');

form.addEventListener('submit', (e) => {
    e.preventDefault()
    //console.log(e.target)
    const datForm = new FormData(e.target)
    const prod = Object.fromEntries(datForm)
    console.log(prod)
    socket.emit('newProduct', prod)

})

socket.on('products', products => {
	productsContainer.innerHTML = '';
	products.forEach(prod => {
		productsContainer.innerHTML += `
        <div class="card" style="width: 18rem;">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Id: ${prod.id}</li>
          <li class="list-group-item">Title: ${prod.title}</li>
          <li class="list-group-item">Description: ${prod.description}</li>
          <li class="list-group-item">Price: ${prod.price}</li>
          <li class="list-group-item">Status: ${prod.status}</li>
          <li class="list-group-item">Code: ${prod.code}</li>
          <li class="list-group-item">Thumbnail: ${prod.thumbnail}</li>
          <li class="list-group-item">Stock: ${prod.stock}</li>
          
        </ul> </br>   
       </div>
  
    `;
	});
});