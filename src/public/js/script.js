alert("Hola!!!")
const socket = io()

socket.emit('mensaje', "Hola Servicdor, que tal?")
socket.on('respuesta', (info) => {
    if(info) {
        socket.emit('juego', "poker")
    }
})