
 const map = L.map('mape');
 map.setView([10.972990, -74.796790],12);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var select = false
 

const latitudElement = document.getElementById('latitudValue');
const longitudElement = document.getElementById('longitudValue');
const direccionElement = document.getElementById('direccionValue');
const horaElement = document.getElementById('horaValue');
const fechaElement = document.getElementById('fechaValue');
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
  
 

  let time1 = null;
  let time2 = null;

  let date = null
  let hi =[];
  let pol = null;
  let pol2 = null;
  const btn = document.getElementById("boton");
  const btn2 = document.getElementById("boton2");
  
  document.getElementById("calendar").addEventListener("change", function() {
      let input = this.value;
      time1 =  Date.parse(input)
    
   
      
    });
    
    document.getElementById("calendarF").addEventListener("change", function() {
      let input2 = this.value;
       time2 =  Date.parse(input2)
      
      
    });
  
  
  
    btn.addEventListener("click",  function(){
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
  
  
      })
  
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
        else pol = L.polyline(task_names, {color: 'red'}).addTo(map);
     
      
        });
  
    }

    let vecth = [];
    var circle = null;


    btn2.addEventListener("click",  function(){

      select = true

    })


    map.on('click',  function(e) {

      if (select){

  
      let xd = new L.LatLng(e.latlng.lat, e.latlng.lng)
    
     vecth = [e.latlng.lat,e.latlng.lng] 

         
    fetch('/histo2',{
      headers: {
       'Content-Type': 'application/json'

      },
      method: 'POST',
      body: JSON.stringify(vecth)


    })


    fetchHisto2()
    select = false;
  }

  }); 


  function fetchHisto2() {
    fetch('/api2')
    .then(response => {
      return response.json();
    })
    .then(json => {

      var h2  = json.data;

      if (h2 == 0){

        alert('El vehiculo no ha pasado por esa ubicación')
      }
    
       task = [];
        timestamp = [];
     
   
      for (var i = 0, max = h2.length; i < max; i += 1) {
    
          task.push([h2[i].latitud,h2[i].longitud]);
          timestamp.push(h2[i].fecha)
          
       
      }

      
     slider.max = task.length-1 
     

      if(pol2) pol2.setLatLngs(task)
    else pol2 = L.polyline(task, {color: 'purple'}).addTo(map);

    /* if (circle) circle.setLatLng(vecth) 
    else circle = L.circle(vecth, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0,
      radius: 1100
  }).addTo(map); */
    

    if (marker2) marker2.setLatLng(task[0])
    else marker2 = L.marker(task[0])
      .bindPopup(`
        Fecha: ${new Date(timestamp[0]).toLocaleString('CO')}
      `).addTo(map)
     

    });
  }

  slider.addEventListener("change", function() {

    marker2.setLatLng(task[slider.value])
    .bindPopup(`
      Fecha: ${new Date(timestamp[slider.value]).toLocaleString('CO')}
    `).addTo(map)


  })

