const moreInfoBtn = document.querySelector('#more');
const closeMoreInfoBtn = document.querySelector('#close-btn');
const menuBtn = document.querySelector('#menu-btn');
const menu = document.querySelector('#menu');
const closeMenu = document.querySelector('#close-menu');
const detailsContenedor = document.querySelector('#details');
const formulario = document.querySelector('#formulario');
const nextDaysSection = document.querySelector('#next-days');
const todayBtn = document.querySelector('#today');
const tomorrowBtn = document.querySelector('#tomorrow');
const themeBtn = document.querySelector('#theme-btn');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const time = new Date();

let userLocation = {
  latitude:' ',
  longitude:' ',
}
let userClima = {}

let dark = true;
// Escuchas de eventos
document.addEventListener('DOMContentLoaded', ()=>{
  geolocalizar();
  moreInfoBtn.addEventListener('click', ui.mostrarMasInfo);
  closeMoreInfoBtn.addEventListener('click', ui.mostrarMasInfo);
  menuBtn.addEventListener('click', ui.mostrarMenu);
  closeMenu.addEventListener('click', ui.mostrarMenu);
  // formulario.addEventListener('submit', validarFormulario);
  todayBtn.addEventListener('click', geolocalizar);
  tomorrowBtn.addEventListener('click', ui.changeDay);
  themeBtn.addEventListener('click', ui.changeTheme)
});
// geocaliza al usuario
function geolocalizar(){
  navigator.geolocation.getCurrentPosition((success) => {
    let {latitude, longitude } = success.coords;
    userLocation.latitude = latitude;
    userLocation.longitude = longitude;
    buscarClima(latitude, longitude);
    // console.log(userLocation);
  });
}
class UI {
  changeTheme(){
    document.querySelector('body').classList.toggle('dark');
    themeBtn.classList.toggle('btn-dark');
    themeBtn.classList.toggle('btn-light');
    if (dark) {
      themeBtn.textContent = 'Light Mode';
      dark = false;
    } else {
      themeBtn.textContent = 'Dark Mode';
      dark = true;
    }
  }
  mostrarMasInfo() {
    // Cuando el usuario solicita mas informacion del clima, esta funcion lo muestra
    detailsContenedor.classList.toggle('active');
  }

  // Muestra el menu
  mostrarMenu() {
    menu.classList.toggle('open');
  }

  mostrarClima({current, timezone, daily}){
    this.temperaturaPrincipal(current, timezone);
    this.iconPrincipal(current);
    this.minMaxTemperatura(daily[0]);
    this.datails(current);
    this.nextDays(daily);
  }

  iconPrincipal({weather}){
    const iconClima = document.querySelector('#icon-clima');
    switch (weather[0].main) {
      case 'Thunderstorm':
      iconClima.src='../img/icons/thunder.svg'
      break;
      case 'Drizzle':
      iconClima.src='../img/icons/rainy-2.svg'
      break;
      case 'Rain':
      iconClima.src='../img/icons/rainy-7.svg'
      break;
      case 'Snow':
      iconClima.src='../img/icons/snowy-6.svg'
      break;                        
      case 'Clear':
      iconClima.src='../img/icons/day.svg'
      break;
      case 'Atmosphere':
      iconClima.src='../img/icons/weather.svg'
      break;  
      case 'Clouds':
      iconClima.src='../img/icons/cloudy-day-1.svg'
      break;  
      default:
      iconClima.src='../img/icons/cloudy-day-1.svg'
    }
  }
        
  iconNextDays({weather}){
    switch (weather[0].main) {
    case 'Thunderstorm':
    return '../img/icons/thunder.svg'
    break;
    case 'Drizzle':
    return '../img/icons/rainy-2.svg'
    break;
    case 'Rain':
    return '../img/icons/rainy-7.svg'
    break;
    case 'Snow':
    return '../img/icons/snowy-6.svg'
    break;                        
    case 'Clear':
    return '../img/icons/day.svg'
    break;
    case 'Atmosphere':
    return '../img/icons/weather.svg'
    break;  
    case 'Clouds': 
    return '../img/icons/cloudy-day-1.svg'
    break;  
    default:
     return '../img/icons/cloudy-day-1.svg'
    }
  }

  temperaturaPrincipal({temp}, timezone){
    const temperaturaMain = parseInt(temp);
    const temperaturaContainer = document.querySelector('#temperature');
    temperaturaContainer.innerHTML = `${temperaturaMain} °C`;
    
    const location = document.querySelector('#location');
    timezone = timezone.slice(timezone.indexOf('/')+1);
    timezone = timezone.replace('/', ', ');
    location.textContent = `${timezone}`;
  }

  minMaxTemperatura({temp:{min, max}}){
    const minContainer = document.querySelector('#min'); 
    const maxContainer = document.querySelector('#max'); 
    
    const temperaturaMin = parseInt(min);
    const temperaturaMax = parseInt(max); 
    
    minContainer.textContent = `${temperaturaMin}°C`;
    maxContainer.textContent = `${temperaturaMax}°C`;
  }

  changeDay(){
    let temp = userClima.daily[0].temp.day;
    const temperaturaMain = parseInt(temp);
    const temperaturaContainer = document.querySelector('#temperature');
    temperaturaContainer.innerHTML = `${temperaturaMain} °C`;
    
    const min = userClima.daily[0].temp.min;
    const max = userClima.daily[0].temp.max;

    const minContainer = document.querySelector('#min'); 
    const maxContainer = document.querySelector('#max'); 
    
    const temperaturaMin = parseInt(min);
    const temperaturaMax = parseInt(max); 
    
    minContainer.textContent = `${temperaturaMin}°C`;
    maxContainer.textContent = `${temperaturaMax}°C`;

   const {wind_speed, feels_like:{day}, humidity, visibility} = userClima.daily[0];
   document.querySelector('#wind').textContent = `${wind_speed} Km/h`;
   document.querySelector('#feels-like').textContent = `${parseInt(day)} °C`;
   document.querySelector('#humidity').textContent = `${humidity}%`;
   document.querySelector('#visibility').textContent = `Desconocida`;

  }

  datails({wind_speed, feels_like, humidity, visibility}){
    document.querySelector('#wind').textContent = `${wind_speed} Km/h`;
    document.querySelector('#feels-like').textContent = `${parseInt(feels_like)} °C`;
    document.querySelector('#humidity').textContent = `${humidity}%`;
    document.querySelector('#visibility').textContent = `${visibility / 100}Km`;
  }

  nextDays(daily){
    let diaActual = time.getDay();
    daily.forEach((dia, index) => {
      if (diaActual <= 6) {
        const iconSrc = ui.iconNextDays(dia);
        const { temp } = dia;
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'card-next-day');
        cardDiv.innerHTML = `
          <div class="card-header">
            <p style="color:white;" class="mm-text day-text">${days[diaActual]}</p>
            <img src="${iconSrc}" class="icon-day">
          </div>
          <div class="card-body">
            <p style="color:white;" class="text">${parseInt(temp.min)}°C</p>
            <p style="color:white;" class="text">${parseInt(temp.max)}°C</p>
          </div>
        `;
        diaActual = diaActual + 1 ;
        nextDaysSection.appendChild(cardDiv);
        
      }else{
        diaActual = 0;
      }
    });
  }
}

// De Kelvin a centigrados
const kelvinACentigrados = grados =>  parseInt( grados - 273.15 );

const ui = new UI();


// Valida que el se hayan ingresado los datos
function validarFormulario(e){
  e.preventDefault();
  const ciudad = document.querySelector('#ciudad').value;
  const pais = document.querySelector('#pais').value;
  if (ciudad === '' || pais === '') {
    alert('Ambos campos son obligatorios');
  } else {
    buscarClima(ciudad, pais);
  }
}
function limpiarHTML() {
  while (nextDaysSection.firstChild) {
    nextDaysSection.firstChild.remove();
  }
}
function buscarClima(latitude, longitude) {
  limpiarHTML();
  const appId = '374cff81c8e08b2c83935fcdbcde0b43';
  const urlDay = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${appId}`;
  
  fetch(urlDay)
    .then ( resultado => resultado.json())
    .then ( clima =>{
      if (clima.cod === '404') {
        alert('Ciudad no encontrada');
        // formulario.reset();c
        return ;
      }
      userClima = clima;
      // formulario.reset();
      ui.mostrarClima(clima);
      // console.log(userClima)
    });

  // const urlDaily = `https://api.openweathermap.org/data/2.5/onecall?q=${ciudad},${pais}&exclude=hourly,daily&appid=${appId}`;
  
  // fetch(urlDaily)
  //   .then( result => result.json() )
  //   .then( climaDiario => {
  //     console.log(climaDiario);
  //   })

}

