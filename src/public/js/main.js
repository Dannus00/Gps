
 const map = L.map('mape');
 map.setView([10.972990, -74.796790],12);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var select = false
 

const latitudElement = document.getElementById('latitudValue');
const longitudElement = document.getElementById('longitudValue');
const horaElement = document.getElementById('horaValue');
const fechaElement = document.getElementById('fechaValue');
const rpmElement = document.getElementById('rpmValue');


const latitudElement1 = document.getElementById('latitudValue1');
const longitudElement1 = document.getElementById('longitudValue1');
const horaElement1 = document.getElementById('horaValue1');
const fechaElement1 = document.getElementById('fechaValue1');
const rpmElement1 = document.getElementById('rpmValue1');


let marker = null;
let marker2 = null;
let line = null;
let line2 = null;
let array = [];
let array2 = [];
let slider = document.getElementById('his');
let task = [];
let timestamp = [];


function fetchMessage() {
    fetch('/data')
      .then(response => {
        return response.json();
      })
      .then(json => {

        const {longitud, latitud, direccion,fecha,rpm,id_placa}   = json.data;
        latitudElement.innerText = latitud;
        longitudElement.innerHTML = longitud;
      

        if (rpm == null || rpm == 0){

          rpmElement.innerHTML = "Device not connected";
        }else{
          rpmElement.innerHTML = rpm ;  
           
        }

        const opciones = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC'
        };

       var fech = new Date(fecha)
      
      var fechaFormateada = fech.toLocaleDateString("es-CO", opciones);
      var result = fech.toLocaleTimeString('en-US')
        horaElement.innerHTML = result; 
        fechaElement.innerHTML= fechaFormateada; 
    
     
    
        let Gps = new L.LatLng(latitud, longitud)
        array.push(Gps);

       
        var customIcon = new L.Icon({
                iconUrl: '/js/view/coche-de-turismo.png',
                iconSize: [40, 40],
                
                
                
            });

        

        if (marker) marker.setLatLng(Gps)
        else{
          marker = L.marker(Gps, {icon: customIcon}).bindPopup('Placa : DHL487').addTo(map)
          marker.on('click', follow)
        }


        if(line) line.setLatLngs(array)
        else line = L.polyline(array, {color: 'blue'}).addTo(map);
       
     
        });

  }
  setInterval(fetchMessage, 5000) ;




  //=====================================================================//
  function fetchMessage2() {
    fetch('/data2')
      .then(response => {
        return response.json();
      })
      .then(json => {

        const {longitud, latitud, direccion,fecha,rpm,id_placa}   = json.data;
        latitudElement1.innerText = latitud;
        longitudElement1.innerHTML = longitud;
   
        if (rpm == null || rpm == 0){

          rpmElement1.innerHTML = "Device not connected";
        }else{
          rpmElement1.innerHTML = rpm ;  
           
        }


        const opciones = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC'
        };

       var fech = new Date(fecha)
      
      var fechaFormateada = fech.toLocaleDateString("es-CO", opciones);
      var result = fech.toLocaleTimeString('en-US')
        horaElement1.innerHTML = result; 
        fechaElement1.innerHTML= fechaFormateada; 
    
     
    
        let Gps = new L.LatLng(latitud, longitud)
        array2.push(Gps);

       
        var customIcon = new L.Icon({
                iconUrl: '/js/view/coche-de-turismo.png',
                iconSize: [40, 40],
                
                
                
            });

        

        if (marker2) marker2.setLatLng(Gps)
        else{
          marker2 = L.marker(Gps, {icon: customIcon}).bindPopup('Placa : MJD123').addTo(map)
          marker2.on('click', follow)
        }


        if(line2) line2.setLatLngs(array2)
        else line2 = L.polyline(array2, {color: 'Purple'}).addTo(map);
       
     
        });

  }
  setInterval(fetchMessage2, 5000) ;



//==================================================================================//
  let followTimer
  let target

  const follow = (e) => {
        stop(e)
        target = e.sourceTarget
        followTimer = setInterval(() => map.setView(target._latlng), 1000)
    } 

  const stop = e => {
     
      clearTimeout(followTimer);
      }

  map.on('zoomend', stop)
  map.on('dragstart', stop)