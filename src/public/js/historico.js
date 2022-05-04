const map = L.map('mape');
map.setView([10.972990, -74.796790],12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var select = false
let slider = document.getElementById('his');
let marker2 = null;
let task = [];
let timestamp = [];


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
          /*cambios*/
          timestamp = [];
          task = [];
   
          for (var i = 0, max = hi.length; i < max; i += 1) {
           
              task.push([hi[i].latitud,hi[i].longitud]);
              timestamp.push(hi[i].fecha)
           
          }
          console.log(timestamp)
          console.log(task)
  
          if(pol) pol.setLatLngs(task)
        else pol = L.polyline(task, {color: 'red'}).addTo(map);



        slider.max = task.length-1 
        
        if(marker2) marker2.setLatLngs(task[0])
        else marker2 = L.marker(task[0]).bindPopup( `
        Fecha: ${new Date(timestamp[0]).toLocaleString('CO')}
      `).addTo(map);

        });
  
    }

    slider.addEventListener("change", function() {

      marker2.setLatLng(task[slider.value])
      .bindPopup( `
          Fecha: ${new Date(timestamp[slider.value]).toLocaleString('CO')}
        `).addTo(map)
  
  
    })

    let vecth = [];
    var circle = null;


   