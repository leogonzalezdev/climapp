const moreInfoBtn = document.querySelector('#more');
const closeMoreInfoBtn = document.querySelector('#close-btn');
const menuBtn = document.querySelector('#menu-btn');
const menu = document.querySelector('#menu');
const closeMenu = document.querySelector('#close-menu');
const detailsContenedor = document.querySelector('#details');
const formulario = document.querySelector('#formulario');
const nextDaysSection = document.querySelector('#next-days');

// Escuchas de eventos
document.addEventListener('DOMContentLoaded', ()=>{
  geolocalizar();
  moreInfoBtn.addEventListener('click', ui.mostrarMasInfo);
  closeMoreInfoBtn.addEventListener('click', ui.mostrarMasInfo);
  menuBtn.addEventListener('click', ui.mostrarMenu);
  closeMenu.addEventListener('click', ui.mostrarMenu);
  formulario.addEventListener('submit', validarFormulario);
});
// geocaliza al usuario
function geolocalizar(){
  navigator.geolocation.getCurrentPosition((success) => {
    let {latitude, longitude } = success.coords;
    buscarClima(latitude, longitude);
  });
}
class UI {
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
  datails({wind_speed, feels_like, humidity, visibility}){
    document.querySelector('#wind').textContent = `${wind_speed} Km/h`;
    document.querySelector('#feels-like').textContent = `${parseInt(feels_like)} °C`;
    document.querySelector('#humidity').textContent = `${humidity}%`;
    document.querySelector('#visibility').textContent = `${visibility / 100}Km`;
  }
  nextDays(daily){
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const time = new Date();
    let diaActual = time.getDay();

    daily.forEach((dia, index) => {
      if (diaActual <= 6) {
        const { temp } = dia;
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
          <p style="color:white;" class="mm-text">${days[diaActual]}</p>
          <p style="color:white;" class="temperature ">${parseInt(temp.day)}°C</p>
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
    console.log('Ambos campos son obligatorios');
  } else {
    buscarClima(ciudad, pais);
  }
}

function buscarClima(latitude, longitude) {
  const appId = '374cff81c8e08b2c83935fcdbcde0b43';
  const urlDay = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${appId}`;
  
  fetch(urlDay)
    .then ( resultado => resultado.json())
    .then ( clima =>{
      if (clima.cod === '404') {
        console.log('Ciudad no encontrada');
        formulario.reset();
        return ;
      }
      console.log(clima)
      formulario.reset();
      ui.mostrarClima(clima);
    });

  // const urlDaily = `https://api.openweathermap.org/data/2.5/onecall?q=${ciudad},${pais}&exclude=hourly,daily&appid=${appId}`;
  
  // fetch(urlDaily)
  //   .then( result => result.json() )
  //   .then( climaDiario => {
  //     console.log(climaDiario);
  //   })

}
