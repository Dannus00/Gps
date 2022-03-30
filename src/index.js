const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
require('dotenv').config();
const mysql = require('mysql');
const dgram = require('dgram');
const Server = dgram.createSocket('udp4');
const HOST = '0.0.0.0';
const PRT = 20000;
const bodyparser = require('body-parser');


//este es un cambio de prueba//

let fini = 0;
let hini = 0;
let fifin = 0;
let  hfin = 0;

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "public")));

var con = mysql.createConnection({

  host: process.env.H,
  user: process.env.U,
  password:process.env.P,
  database: process.env.dB
  
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//=============================================================
Server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  Server.close();
});
Server.on('message', (msg, rinfo) => {
  console.log(`Mensaje Recibido desde el cliente: ${msg} `);
  //console.log(msg)
  const arrayProps = msg.toString().split("\n");
    const arrayValues = [];
    arrayProps.forEach(element => {
      const value = element.split(': ')[1];
      arrayValues.push(value);
    });
    const [latitud, longitud, direccion, hora, fecha] = arrayValues;

    var sql = `INSERT INTO Datos (latitud,longitud,direccion,hora,fecha) VALUES ('${latitud}', '${longitud}', '${direccion}','${hora}','${fecha}')`;  
      con.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("Localizacion Guardada");  
        });   
});


 Server.on('listening', () => {
  const address = Server.address();
  console.log(`Servidor: ${address.address}:${address.port}`);
});

 

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/data', (req, res) => {
  

  con.query('select * from Datos ORDER BY id DESC LIMIT 1',(err,mess, fields)=>{
    
      res.status(200).json({
      data: mess[0],
      
      
    });
    
    })

});

app.post('/api',(req,res)=>{

    fini = req.body[0]
    hini = req.body[1]
    fifin = req.body[2]
    hfin = req.body[3]
   
    console.log(fini)
    console.log(hini)
    console.log(fifin)
    console.log(hfin)

  




});

app.post("/push",(req,res)=>{

console.log("push")
res.sendStatus(200)
})


app.get('/histo', (req, res) => {
  

  con.query(`SELECT latitud,longitud FROM Datos
  WHERE fecha BETWEEN '${fini}' AND '${fifin}' AND hora BETWEEN "${hini}" AND "${hfin}" ORDER BY id`,(err,mesh, fields)=>{
    
      res.status(200).json({
        data: mesh,
      
      
     });
    
    })

});






app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});

Server.bind({
  address: HOST,
  port: PRT,
  exclusive: true
});

  
