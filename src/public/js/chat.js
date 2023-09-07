const socket = io();

const botonChat = document.getElementById('botonChat')
const parrafosMensajes = document.getElementById('parrafosMensajes')
const valInput = document.getElementById('chatBox')
let user 

swal.fire({
    title: "Identificación de Usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && 'Ingrese un nombre de usuario valido'
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value
    console.log(user)
})


botonChat.addEventListener('click', () => {
    let fechaActual = new Date().toLocaleString()
    console.log(fechaActual)
    if (valInput.value.trim().length > 0) {
        socket.emit('mensaje', { fecha: fechaActual, user: user, mensaje: valInput.value})  //evitar mensaje vacio
        valInput.value = ""    //Limpio el input
    }
})

socket.on('mensajes', arrayMensajes => {
    parrafosMensajes.innerHTML = ""
    arrayMensajes.forEach(mensaje => {
        parrafosMensajes.innerHTML += `<p>${mensaje.fecha} : ${mensaje.user} escribio ${mensaje.mensaje}</p>`
        
    });
})