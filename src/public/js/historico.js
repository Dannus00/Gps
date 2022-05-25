const map = L.map('mape');
map.setView([10.972990, -74.796790], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
var select = false
let slider = document.getElementById('his');
let slider2 = document.getElementById('his2');
let marker2 = null;
let marker3 = null;
let task = [];
let timestamp = [];
let rpm = [];
let rpm2 = [];
let task2 = [];
let timestamp2 = [];
let placa = null;
const fechaElement = document.getElementById('fechaValue');
const fechaElement2 = document.getElementById('fechaValue2');
const rpmElement = document.getElementById('rpmValue');
const rpmElement2 = document.getElementById('rpmValue2');
let time1 = null;
let time2 = null;

let date = null
let hi = [];
let pol = null;
let pol2 = null;
const btn = document.getElementById("boton");
const btn2 = document.getElementById("boton2");

document.getElementById("calendar").addEventListener("change", function () {
  let input = this.value;
  time1 = Date.parse(input)
  document.getElementById("calendarF").min=this.value



});

document.getElementById("calendarF").addEventListener("change", function () {
  let input2 = this.value;
  time2 = Date.parse(input2)
  document.getElementById("calendar").max=this.value


});

document.getElementById("dropdown").addEventListener("change", function () {
  placa = this.value;
  console.log(placa);


});


btn.addEventListener("click", function () {

  if (placa == null || placa == 0) {

    alert('Seleccione su vehiculo')
  } else if (time1 == null || time2 == null) {

    alert('Por favor ingresar fechas')

  } else if (time1 > time2) {
    alert('La fecha inicial es mayor a la fecha final, por favor corrija las fechas. ')
  } else {
    date = [time1, time2, placa];
  }




  fetch('/api', {
    headers: {
      'Content-Type': 'application/json'

    },
    method: 'POST',
    body: JSON.stringify(date)


  })

  fetchHisto();

});


async function fetchHisto() {

/*========================   placa 1* ============================*/
  if (placa == 1) {

    try{
    map.removeLayer(marker3)
    map.removeLayer(pol2)
    map.addLayer(marker2)
    map.addLayer(pol)
    }catch(e){}

    slider2.disabled = true;
    slider.disabled = false;
    let response = await fetch(`/histo?time1=${time1}&time2=${time2}&placa=${placa}`)
    let json = await response.json();

    hi = json.data;
  
    /*cambios*/
    timestamp = [];
    task = [];
    timestamp2 = [];
    task2 = [];
    rpm = [];
    rpm2 = [];

    for (var i = 0, max = hi.length; i < max; i += 1) {

      task.push([hi[i].latitud, hi[i].longitud]);
      timestamp.push(hi[i].fecha)
      rpm.push(hi[i].rpm)

    }
    console.log(rpm)

    if (pol) pol.setLatLngs(task)
    else pol = L.polyline(task, { color: 'red' }).addTo(map);

    slider.max = task.length - 1

    if (marker2) marker2.setLatLngs(task[0])
    else marker2 = L.marker(task[0]).bindPopup(`
        Fecha: ${new Date(timestamp[0]).toLocaleString('CO')}
      `).addTo(map);

  }/*========================   placa 2* ============================*/
  if (placa == 2) { 
  
    try{
      map.removeLayer(marker2)
      map.removeLayer(pol)
      map.addLayer(marker3)
      map.addLayer(pol2)
      }catch(e){}

      slider2.disabled = false;
      slider.disabled = true;
  
  
      let response = await fetch(`/histo?time1=${time1}&time2=${time2}&placa=${placa}`)
      let json = await response.json();

   timestamp = [];
    task = [];
    timestamp2 = [];
    task2 = [];
    rpm = [];
    rpm2 = [];
      
    for (var i = 0, max = json.data.length; i < max; i += 1) {

      task2.push([json.data[i].latitud, json.data[i].longitud]);
      timestamp2.push(json.data[i].fecha)
      rpm2.push(json.data[i].rpm)

    }
    console.log(timestamp2)
    console.log(task2)

    if (pol2) pol2.setLatLngs(task2)
    else pol2 = L.polyline(task2, { color: 'blue' }).addTo(map);

    slider2.max = task2.length - 1

    if (marker3) marker3.setLatLngs(task2[0])
    else marker3 = L.marker(task2[0]).bindPopup(`
        Fecha: ${new Date(timestamp2[0]).toLocaleString('CO')}
      `).addTo(map);






  /*========================   Ambas placas ============================*/
   }if(placa == 3) {

    try{
      map.addLayer(marker3)
      map.addLayer(pol2)
      map.addLayer(marker2)
      map.addLayer(pol)

      slider2.disabled = false;
      slider.disabled = false;

    }catch(e){}
    let response1 = await fetch(`/histo?time1=${time1}&time2=${time2}&placa=${1}`)
    let json1 = await response1.json();
    let response2= await fetch(`/histo?time1=${time1}&time2=${time2}&placa=${2}`)
    let json2= await response2.json();

    
    /*cambios*/
    timestamp = [];
    task = [];
    timestamp2 = [];
    task2 = [];
    rpm = [];
    rpm2 = [];

    for (var i = 0, max = json1.data.length; i < max; i += 1) {

      task.push([json1.data[i].latitud, json1.data[i].longitud]);
      timestamp.push(json1.data[i].fecha)
      rpm.push(json1.data[i].rpm)


    }
    console.log(timestamp)
    console.log(task)

    if (pol) pol.setLatLngs(task)
    else pol = L.polyline(task, { color: 'red' }).addTo(map);

    slider.max = task.length - 1
    

    if (marker2) marker2.setLatLng(task[0])
    else marker2 = L.marker(task[0]).bindPopup(`
        Fecha: ${new Date(timestamp[0]).toLocaleString('CO')}
      `).addTo(map);

      

      for (var i = 0, max = json2.data.length; i < max; i += 1) {

        task2.push([json2.data[i].latitud, json2.data[i].longitud]);
        timestamp2.push(json2.data[i].fecha)
        rpm2.push(json2.data[i].rpm)
        
  
      }
      console.log(timestamp2)
      console.log(task2)
  
      if (pol2) pol2.setLatLngs(task2)
      else pol2 = L.polyline(task2, { color: 'blue' }).addTo(map);
  
      slider.max = task.length - 1
      slider2.max = task2.length - 1
      if (marker3) marker3.setLatLngs(task2[0])
      else marker3 = L.marker(task2[0]).bindPopup(`
          Fecha: ${new Date(timestamp2[0]).toLocaleString('CO')}
        `).addTo(map);


  }
}

slider.addEventListener("change", function () {

  marker2.setLatLng(task[slider.value])
    .bindPopup(`
          Fecha: ${new Date(timestamp[slider.value]).toLocaleString('CO')}
        `).addTo(map)

  fechaElement.innerHTML = new Date(timestamp[slider.value]).toLocaleString('CO');
  if (rpm[slider.value] == null || rpm[slider.value]  == 0 ){
    rpmElement.innerHTML = ('Device not connected')
  }else{

    rpmElement.innerHTML = (rpm[slider.value])
  }

})

slider2.addEventListener("change", function () {

  marker3.setLatLng(task2[slider2.value])
    .bindPopup(`
          Fecha: ${new Date(timestamp2[slider2.value]).toLocaleString('CO')}
        `).addTo(map)

  fechaElement2.innerHTML = new Date(timestamp2[slider2.value]).toLocaleString('CO');
  if (rpm2[slider2.value] == null || rpm2[slider2.value]  == 0 ){
    rpmElement2.innerHTML = ('Device not connected')
  }else{

    rpmElement2.innerHTML = (rpm2[slider2.value])
  }

})


