const socket = io();

const productsContainer = document.querySelector('#productos');

socket.emit('load');

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
