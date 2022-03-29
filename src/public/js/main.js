
 const map = L.map('mape');
 map.setView([10.9023415, -74.8109302],12);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
 

const latitudElement = document.getElementById('latitudValue');
const longitudElement = document.getElementById('longitudValue');
const direccionElement = document.getElementById('direccionValue');
const horaElement = document.getElementById('horaValue');
const fechaElement = document.getElementById('fechaValue');
let marker = null;
let line = null;
let array = [];

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
    
     
    
        let Gps = new L.LatLng(latitud, longitud)
        array.push(Gps);

       
        var customIcon = new L.Icon({
                iconUrl: '/js/view/coche-de-turismo.png',
                iconSize: [40, 40],
                
                
                
            });

        

        if (marker) marker.setLatLng(Gps)
        else marker = L.marker(Gps, {icon: customIcon}).bindPopup('Usted está aquí').addTo(map)

        if(line) line.setLatLngs(array)
        else line = L.polyline(array, {color: 'blue'}).addTo(map);
        //(`latitud: ${latitud}`)

        //=====================//
       
      });

  }
  setInterval(fetchMessage, 5000) ;

  