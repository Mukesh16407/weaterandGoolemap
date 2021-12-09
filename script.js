

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'
     
    const timeEl = document.getElementById('time');
    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`
    const dateEl = document.getElementById('date');
    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]
}, 1000);

async function getWeathere() {

    let key ="dd7fa73e412e7d4b26a84b058a427602";
  
      try{
          let city = document.getElementById("city").value;
  
          let res1 = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`);
          let data1 = await res1.json();
          let latitude = data1.coord.lat;
          let longitude = data1.coord.lon;
  
          //console.log(latitude,longitude)
         let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${key}`;
  
         let res = await fetch(url);
         let data = await res.json();
         console.log("data", data);
         showWeatherData(data)
      }catch(err){
         console.log("er:", err);
      }finally{
          console.log("Worked finally")
      }
     
  }

function showWeatherData (data){
  let {humidity, pressure, sunrise, sunset, wind_speed} = data.current;
  
  const timezone = document.getElementById('time-zone');
  timezone.innerHTML = data.timezone;

  const countryEl = document.getElementById('country');
  countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'
  
  const currentWeatherItemsEl = document.getElementById('current-weather-items');
  currentWeatherItemsEl.innerHTML =  
`<div class="weather-item">
      <div>Humidity</div>
      <div>${humidity}%</div>
  </div>
  <div class="weather-item">
      <div>Pressure</div>
      <div>${pressure}pa</div>
  </div>
  <div class="weather-item">
      <div>Sunrise</div>
      <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
  </div>
  <div class="weather-item">
      <div>Sunset</div>
      <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
  </div>
  <div class="weather-item">
  <div>Wind Speed</div>
  <div>${wind_speed} Km/h</div>
</div> `;
  const current_temp = document.getElementById('current-temp1');

  let temp_show = document.createElement('div');
  temp_show.innerHTML =`<div class="tempBox-item">
  <div class="currentfont">Temp</div>
  <div class="currentfont">${data.current.temp}&#176;C</div>
</div>`
  let current_description = document.createElement('p');
  current_description.textContent ="Weather- " + data.current.weather[0].description;
  let current_location = document.getElementById("city").value;
  let add_location = document.createElement("h4");
  add_location.textContent = current_location
  let curent_logo = document.createElement('img');
  curent_logo.setAttribute("class","image")
  curent_logo.src = data.current.weather[0].icon;
  
  current_temp.append(temp_show,current_description,add_location,curent_logo);

  let otherDayForcast = ''
  data.daily.forEach((day, index) => {
      if(index == 0){
        const currentTempEl = document.getElementById('current-temp');
        currentTempEl.innerHTML = 
          `<img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
          <div class="other">
              <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
              <div class="temp">Night - ${day.temp.night}&#176;C</div>
              <div class="temp">Day - ${day.temp.day}&#176;C</div>
          </div>`
         
      }else{
       
          otherDayForcast += `
          <div class="weather-forecast-item">
              <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
              <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
              <div class="temp">Night - ${day.temp.night}&#176;C</div>
              <div class="temp">Day - ${day.temp.day}&#176;C</div>
          </div>
          
          `
      }
  })
  const weatherForecastEl = document.getElementById('weather-forecast');
  weatherForecastEl.innerHTML = otherDayForcast;
 
}

document.getElementById('btn').addEventListener("click",googleMap)
async function googleMap() {
    let googleBox = document.getElementById("GoogleMap");
   
    let city = document.getElementById("city").value;
    let url = `https://www.google.com/maps/embed/v1/place?key=AIzaSyAczp3frE9XCVtwkqgxxwVy_bgOIFAdS9k
  &q=${city}`;

    // let res = await fetch(url);
    // let data = await res.json();
    // console.log("data", data);

    // let temp = data.main.temp;

    // temp = Math.round(temp - 273);
    // console.log("temp:", temp)
    // }catch(err){
    //    console.log("er:", err);
    // }finally{
    //     console.log("Worked finally")
    // }
  let iframe = document.createElement("iframe");
  iframe.src =url;
  iframe.width="600"
  iframe.height="600"
  iframe.id="gmap"
//   iframe.frameBorder="0"
//   iframe.scrolling ="no"
  iframe.marginheight ="0"
  iframe.marginwidth="0"

  googleBox.innerHTML=""

  googleBox.append(iframe);
}



