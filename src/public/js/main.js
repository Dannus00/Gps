
 const map = L.map('mape');
 map.setView([10.9023415, -74.8109302],12);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
 

const latitudElement = document.getElementById('latitudValue');
const longitudElement = document.getElementById('longitudValue');
const direccionElement = document.getElementById('direccionValue');
const horaElement = document.getElementById('horaValue');
const fechaElement = document.getElementById('fechaValue');
var marker
var array = [];
var gps ={};

function fetchMessage() {
    fetch('/data')
      .then(response => {
        return response.json();
      })
      .then(json => {

        const {longitud, latitud, direccion, hora, fecha}   = json.data;
        latitudElement.innerText = latitud;
        longitudElement.innerHTML = longitud;
        direccionElement.innerHTML = direccion;
        horaElement.innerHTML = hora;
        fechaElement.innerHTML= fecha;
    
        //Polylinea y marcador a tiempo real//
        gps= [[latitud,longitud]];

        for(var i=0; i<1;i++){
           var tr= gps[i];
           array.push(tr);
           console.log(array)
        }

        var polyline = L.polyline(array, {color: 'blue'}).addTo(map);
        marker = L.marker([latitud, longitud]).bindPopup('Usted esta aqui').addTo(map);


        //=====================//
       
      });


         if(marker){
            map.removeLayer(marker)

         }
     

      
  }
  setInterval(fetchMessage, 5000) ;
