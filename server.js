const express = require("express");
const {Server:HttpServer} = require("http");
const {Server:IOServer} = require("socket.io");
const app = express();
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const handlebars = require("express-handlebars");
const fs = require("fs");



app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    LayoutsDir: __dirname + "/views/layouts",
    PartialsDir: __dirname + "views/partials",
  })
);

app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/productos", async (req, res) => {
  const contenido = await fs.promises.readFile("./productos.txt", "utf-8");
  let productos = JSON.parse(contenido);
  res.render("main", { productos });
});

app.post("/productos", async (req, res) => {
  let item = req.body;
  let data = await fs.promises.readFile("./productos.txt", "utf-8");
  let productos = JSON.parse(data);

  let result = productos.map((producto) => producto.id);
  let id = Math.max(...result) + 1;
  item.id = id;
  productos.push(item);
  await fs.promises.writeFile(
    "./productos.txt",
    JSON.stringify(productos, null, 2)
  );
  res.render("main", { productos });
});

let allMensajes = [];

io.on("connection", socket => {
  console.log('Nuevo cliente conectado');
  io.sockets.emit('mensajes', allMensajes);
  

  socket.on('mensaje', data =>{
    mensajes.push(data)    
    io.sockets.emit('mensajes', allMensajes)
  })


  console.log(mensajes)
});
const PORT = process.env.PORT || 8080;

const srv = httpServer.listen(PORT, () => {
  console.log(
    `Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`
  );
});
srv.on("error", (error) => console.log(`Error en servidor ${error}`));
