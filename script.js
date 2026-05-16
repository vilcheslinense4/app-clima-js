const apiKey = "c32c3fcf40992f1a7289cd8f3b7206ca";

// Conexiones HTML
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherData = document.getElementById('weather-data');
const message = document.getElementById('message');
const loading = document.getElementById('loading');

const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

// Capa de efectos
const overlay = document.createElement('div');
overlay.className = 'weather-overlay';
document.body.appendChild(overlay);

// FONDO DE BIENVENIDA: Se ejecuta nada más abrir la web para que la interfaz luzca desde el principio
document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1600&auto=format&fit=crop')";
document.body.style.backgroundSize = "cover";
document.body.style.backgroundPosition = "center";

// CAMBIO DE FONDO SEGÚN EL CLIMA
function updateWeatherExperience(weatherMain, windSpeed) {
    overlay.className = 'weather-overlay'; // Limpiar efectos de movimiento

    // Si hace mucho viento
    if (windSpeed > 25) {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop')";
        overlay.classList.add('wind-effect');
        return;
    }

    switch (weatherMain.toLowerCase()) {
        case 'clear': // SOLEADO
            document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')";
            break;
            
        case 'clouds': // NUBLADO
            document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600&auto=format&fit=crop')";
            break;
            
        case 'rain':
        case 'drizzle':
        case 'thunderstorm': // LLUVIOSO
            document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=1600&auto=format&fit=crop')";
            overlay.classList.add('rain-effect');
            break;
            
        case 'snow': // NEVADO
            document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1485594050903-8e8ee7b071a8?q=80&w=1600&auto=format&fit=crop')";
            overlay.classList.add('snow-effect');
            break;
    }
}

// BUSCAR CLIMA
async function checkWeather(city) {
    message.style.display = "none";
    weatherData.style.display = "none";
    loading.style.display = "block";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );

        loading.style.display = "none";

        if (response.status === 404) {
            message.innerHTML = "<p>Ciudad no encontrada. Revisa si está bien escrita.</p>";
            message.style.display = "block";
            return;
        }

        const data = await response.json();

        cityName.innerText = `${data.name}, ${data.sys.country}`;
        temp.innerText = Math.round(data.main.temp) + "°C";
        description.innerText = data.weather[0].description;
        feelsLike.innerText = Math.round(data.main.feels_like) + "°C";
        humidity.innerText = data.main.humidity + "%";
        wind.innerText = data.wind.speed + " km/h";
        
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Actualizar fondo y efectos
        updateWeatherExperience(data.weather[0].main, data.wind.speed);

        weatherData.style.display = "block";

    } catch (error) {
        console.error("Error al obtener datos:", error);
        loading.style.display = "none";
        message.innerHTML = "<p>Error de conexión.</p>";
        message.style.display = "block";
    }
}

// Eventos básicos y estables
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});
