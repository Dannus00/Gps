
 const map = L.map('mape');
 map.setView([10.972990, -74.796790],12);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var select = false
 

const latitudElement = document.getElementById('latitudValue');
const longitudElement = document.getElementById('longitudValue');
const direccionElement = document.getElementById('direccionValue');
const horaElement = document.getElementById('horaValue');
const fechaElement = document.getElementById('fechaValue');
const rpmElement = document.getElementById('rpmValue');
let marker = null;
let marker2 = null;
let line = null;
let array = [];
let slider = document.getElementById('his');
let task = [];
let timestamp = [];

function fetchMessage() {
    fetch('/data')
      .then(response => {
        return response.json();
      })
      .then(json => {

        const {longitud, latitud, direccion,fecha,rpm}   = json.data;
        latitudElement.innerText = latitud;
        longitudElement.innerHTML = longitud;
        direccionElement.innerHTML = direccion;

        if (rpm == null && rpm == 0){

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
          marker = L.marker(Gps, {icon: customIcon}).bindPopup('Usted está aquí').addTo(map)
          marker.on('click', follow)
        }


        if(line) line.setLatLngs(array)
        else line = L.polyline(array, {color: 'blue'}).addTo(map);
       
     
        });

  }
  setInterval(fetchMessage, 5000) ;


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