const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const child_p = require('child_process')
require('dotenv').config();
const mysql = require('mysql');
const dgram = require('dgram');
const Server = dgram.createSocket('udp4');
const HOST = '0.0.0.0';
const PRT = 20000;
const bodyparser = require('body-parser');



let fini = 0;
let fifin = 0;
let placa = 0;


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
    const [latitud, longitud, direccion,fecha,rpm,id_placa] = arrayValues;

    var sql = `INSERT INTO Datos (latitud,longitud,direccion,fecha,rpm,id_placa) VALUES ('${latitud}', '${longitud}', '${direccion}','${fecha}','${rpm}','${id_placa}')`;  
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


//====== Taxi 1 ================//
app.get('/data', (req, res) => {
  

  con.query('select * from Datos where id_placa = 1 ORDER BY id DESC LIMIT 1 ',(err,mess, fields)=>{
    
      res.status(200).json({
      data: mess[0],
      
      
    });
    
    })

});

//====== Taxi 2 ================//
app.get('/data2', (req, res) => {
  

  con.query('select * from Datos where id_placa = 2 ORDER BY id DESC LIMIT 1 ',(err,mess2, fields)=>{
    
      res.status(200).json({
      data: mess2[0],
      
      
    });
    
    })

});



app.post('/api',(req,res)=>{

    fini = req.body[0]
    fifin = req.body[1]
    placa = req.body[2]
    res.sendStatus(200)

});



app.post("/push",(req,res)=>{

  console.log('push')
  child_p.exec('git reset --hard && git pull && pm2 restart src/index.js', (err, stdout, stderr) => {
    console.error('err: ', err)
    console.log('stdout: ', stdout)
    console.error('stderr: ', stderr)
  })
  res.sendStatus(200)



})


app.get('/histo', (req, res) => {

  let {time1,time2,placa} = req.query
 
  con.query(`SELECT * FROM Datos
  WHERE fecha BETWEEN '${time1}' AND '${time2}' AND id_placa = '${placa}' ORDER BY id`,(err,mesh, fields)=>{
    
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

  
