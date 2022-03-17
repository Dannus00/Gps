
 const map = L.map('mape');
 map.setView([10.9023415, -74.8109302],12);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


const latitudElement = document.getElementById('latitudValue');
const longitudElement = document.getElementById('longitudValue');
const direccionElement = document.getElementById('direccionValue');
const horaElement = document.getElementById('horaValue');
const fechaElement = document.getElementById('fechaValue');
var marker

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
    
        //======================//
       
        var lat = latitud;
        var long = longitud;
        
       
        
        marker = L.marker([lat, long]).bindPopup('Usted esta aqui').addTo(map);
       
     

      });


         if(marker){
            map.removeLayer(marker)

         }
     

      
  }
  setInterval(fetchMessage, 5000) ;
