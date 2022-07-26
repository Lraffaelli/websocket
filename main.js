let socket = io.connect(); 

const user = document.getElementById('username')
const msj = document.getElementById('mensaje')
document.getElementById('enviar').addEventListener('click',()=>{
  socket.emit('mensaje',user.value,msj.value)
})

socket.on('mensajes', data =>{
  document.querySelector('#chat').innerText=data
})