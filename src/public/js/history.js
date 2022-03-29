const map = L.map('mape');
map.setView([10.9023415, -74.8109302],12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  let fechaFormateada = null;
  let result = null;
  let fechaFormateada2 = null;
  let result2 = null;
  let date = null
  let hi =[];
  let pol = null;
  const btn = document.querySelector("button");
  const opciones = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    };
  
  document.getElementById("calendar").addEventListener("change", function() {
      let input = this.value;
      let dateEntered = new Date(input);
    
      fechaFormateada = dateEntered.toLocaleDateString("es-CO", opciones);
      result = dateEntered.toLocaleTimeString('en-US')
      console.log(fechaFormateada);
      console.log(result); 
      
    });
    
    document.getElementById("calendarF").addEventListener("change", function() {
      let input2 = this.value;
      let dateEntered2 = new Date(input2);
  
      fechaFormateada2 = dateEntered2.toLocaleDateString("es-CO", opciones);
      result2 = dateEntered2.toLocaleTimeString('en-US')
      console.log(fechaFormateada2);
      console.log(result2); 
  
      
      
      
    });
  
  
  
    btn.addEventListener("click",function(){
      date = [fechaFormateada, result, fechaFormateada2,result2];
    
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
  
  
       /*    console.log(longitud)
          console.log(latitud)
          console.log(direccion)
          console.log(hora)
          console.log(fecha) */
  
          pol = L.polyline(task_names, {color: 'red'}).addTo(map);
        });
  
    }
    //setInterval(fetchHisto, 5000) ;
   
   



    

 
  