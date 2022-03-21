const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const mysql = require('mysql');
const dgram = require('dgram');
const Server = dgram.createSocket('udp4');
const HOST = '0.0.0.0';
const PRT = 20000;
app.use(express.static(path.join(__dirname, "public")));

var con = mysql.createConnection({

  host: "localhost", 
  user: "message", 
  password:"danus371",
  database: "message",
  
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
  console.log(msg)
  const arrayProps = msg.toString().split("\n");
    const arrayValues = [];
    arrayProps.forEach(element => {
      const value = element.split(': ')[1];
      arrayValues.push(value);
    });
    const [latitud, longitud, direccion, hora, fecha] = arrayValues;

    var sql = `INSERT INTO mensaje (latitud,longitud,direccion,hora,fecha) VALUES ('${latitud}', '${longitud}', '${direccion}','${hora}','${fecha}')`;  
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
  console.log(true)
 
  con.query('select * from mensaje ORDER BY id DESC LIMIT 1',(err,mess, fields)=>{
    
      res.status(200).json({
      data: mess[0]
      
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

  
