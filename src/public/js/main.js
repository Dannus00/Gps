
 const map = L.map('mape');
 map.setView([10.972990, -74.796790],12);
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

        const {longitud, latitud, direccion,fecha}   = json.data;
        latitudElement.innerText = latitud;
        longitudElement.innerHTML = longitud;
        direccionElement.innerHTML = direccion;

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
        else marker = L.marker(Gps, {icon: customIcon}).bindPopup('Usted está aquí').addTo(map)


        if(line) line.setLatLngs(array)
        else line = L.polyline(array, {color: 'blue'}).addTo(map);
       
        let followTimer
        let target

        const follow = (e) => {
              stop(e)
              target = e.sourceTarget
              followTimer = setTimeout(() => map.setView(target._latlng), 1000)
          } 

        const stop = (e) => {
           
            clearTimeout(followTimer);
            }

        map.on('zoomend', stop)
        map.on('dragstart', stop)
        marker.on('click', follow)
       
        });

  }
  setInterval(fetchMessage, 5000) ;

  let time1 = null;
  let time2 = null;

  let date = null
  let hi =[];
  let pol = null;
  const btn = document.querySelector("button");
  
  document.getElementById("calendar").addEventListener("change", function() {
      let input = this.value;
      time1 =  Date.parse(input)
    
   
      
    });
    
    document.getElementById("calendarF").addEventListener("change", function() {
      let input2 = this.value;
       time2 =  Date.parse(input2)
      
      
    });
  
  
  
    btn.addEventListener("click", async function(){
      if (time1 == null || time2 == null) {

       alert('Por favor ingresar fechas')

    } else if (time1 > time2) {
      alert('La fecha inicial es mayor a la fecha final, por favor corrija las fechas. ')
    }
      date = [time1, time2];


    
      fetch('/api',{
           headers: {
            'Content-Type': 'application/json'
  
           },
           method: 'POST',
           body: JSON.stringify(date)
  
  
      }).then(res => res.json())
      .then(res => {
        if (res.success) {
          //mensaje correcto
          
        }else{
        //mensaje de error
        }
      })
      .catch(function() {
        console.log("tienes tremendo error papu");
      });
  
      fetchHisto();
      
    });
  
  
    function fetchHisto() {
      fetch('/histo')
        .then(response => {
          return response.json();
        })
        .then(json => {
  
          hi  = json.data;
          console.log(hi)
          
          
          var task_names = [];
   
          for (var i = 0, max = hi.length; i < max; i += 1) {
           
              task_names.push([hi[i].latitud,hi[i].longitud]);
           
          }
  
          console.log(task_names)
  
          if(pol) pol.setLatLngs(task_names)
        else pol = L.polyline(task_names, {color: 'blue'}).addTo(map);
     
          /* pol = L.polyline(task_names, {color: 'red'}).addTo(map); */
        });
  
    }


    map.on('click', function(e) {
      let xd = new L.LatLng(e.latlng.lat, e.latlng.lng)
      
      L.marker([e.latlng.lat,  e.latlng.lng]).bindPopup(`Latitud:  ${e.latlng.lat}, longitud: ${ e.latlng.lng}`).addTo(map);
      
      

     
      console.log(xd)


  }); 


   

