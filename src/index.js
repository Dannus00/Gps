const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const dgram = require('dgram');
const Server = dgram.createSocket('udp4');
const HOST = '0.0.0.0';
const PRT = 20000;
app.use(express.static(path.join(__dirname, "public")));

let Msj

const dbCredentials = {
  user: 'Danus',
  password: 'eiLPIwy4uEUXcwmc',
  cluster: 'cluster0.3mjix',
  db: 'test',
}

mongoose.connect(
  `mongodb+srv://${dbCredentials.user}:${dbCredentials.password}@${dbCredentials.cluster}.mongodb.net/${dbCredentials.db}?retryWrites=true&w=majority`
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("database connected!");
});
//=============================================================
const MessageSchema = mongoose.Schema(
  {
    latitud: String,
    longitud: String,
    direccion: String,
    hora: String,
    fecha: String,
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", MessageSchema);

//=============================================================
Server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  Server.close();
});
Server.on('message', (msg, rinfo) => {
  console.log(`Mensaje Recibido desde el cliente: ${msg} `);
  console.log(msg)
  const arrayProps = msg.toString().split("\n");
    const arrayValues = [];
    arrayProps.forEach(element => {
      const value = element.split(': ')[1];
      arrayValues.push(value);
    });
    const [latitud, longitud, direccion, hora, fecha] = arrayValues;

     const message = new Message({
      latitud,
      longitud,
      direccion,
      hora,
      fecha
     });
    message.save();


});


 Server.on('listening', () => {
  const address = Server.address();
  console.log(`Servidor: ${address.address}:${address.port}`);
});

 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/data', (req, res) => {
  console.log(true)
  Message.findOne({}, {}, { sort: { 'createdAt': -1 } }, function (err, message) {

    console.log(message);
    res.status(200).json({
      data: message,
      
    });
    
  });
});
 
app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});

Server.bind({
  address: HOST,
  port: PRT,
  exclusive: true
});

  
