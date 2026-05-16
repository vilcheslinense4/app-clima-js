const apiKey = "c32c3fcf40992f1a7289cd8f3b7206ca";

// Conexiones HTML
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const datalist = document.getElementById('ciudades-sugeridas');
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

// Crear la capa de efectos de animación de forma dinámica
const overlay = document.createElement('div');
overlay.className = 'weather-overlay';
document.body.appendChild(overlay);

let debounceTimer;
let isDeleting = false;

// Evitar bloqueos al borrar letra a letra
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === 'Delete') {
        isDeleting = true;
    } else {
        isDeleting = false;
    }
});

// 1. BUSCADOR DE SUGERENCIAS EN TIEMPO REAL
async function fetchSuggestions(query) {
    if (query.length < 3 || isDeleting) {
        datalist.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
        const locations = await response.json();

        datalist.innerHTML = "";

        locations.forEach(location => {
            const option = document.createElement('option');
            const state = location.state ? `, ${location.state}` : "";
            option.value = `${location.name}${state}, ${location.country}`;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error("Error buscando sugerencias:", error);
    }
}

// 2. SISTEMA INTERACTIVO DE PAISAJES Y ANIMACIONES
function updateWeatherExperience(weatherMain, windSpeed) {
    const body = document.body;
    overlay.className = 'weather-overlay'; // Resetear animaciones

    // Si el viento es peligrosamente alto (más de 25 km/h), priorizamos el estado de viento fuerte
    if (windSpeed > 25) {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1600&auto=format&fit=crop')";
        overlay.classList.add('wind-effect');
        return;
    }

    // Clasificación por los estados solicitados usando la respuesta oficial de OpenWeather
    switch (weatherMain.toLowerCase()) {
        case 'clear': // SOLEADO
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop')";
            break;
            
        case 'clouds': // NUBLADO
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600&auto=format&fit=crop')";
            break;
            
        case 'rain':
        case 'drizzle':
        case 'thunderstorm': // LLUVIOSO / TORMENTA
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?q=80&w=1600&auto=format&fit=crop')";
            overlay.classList.add('rain-effect');
            break;
            
        case 'snow': // NEVADO
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1485594050903-8e8ee7b071a8?q=80&w=1600&auto=format&fit=crop')";
            overlay.classList.add('snow-effect');
            break;
            
        default: // Fondo neutro por si acaso
            body.style.backgroundImage = "url('https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1600&auto=format&fit=crop')";
            break;
    }
}

// 3. CONSULTAR EL CLIMA
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

        // Inyectar datos en la tarjeta
        cityName.innerText = `${data.name}, ${data.sys.country}`;
        temp.innerText = Math.round(data.main.temp) + "°C";
        description.innerText = data.weather[0].description;
        feelsLike.innerText = Math.round(data.main.feels_like) + "°C";
        humidity.innerText = data.main.humidity + "%";
        wind.innerText = data.wind.speed + " km/h";
        
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Activar la experiencia visual pasando el tipo de clima y la velocidad del viento
        updateWeatherExperience(data.weather[0].main, data.wind.speed);

        weatherData.style.display = "block";

    } catch (error) {
        console.error("Error al obtener datos:", error);
        loading.style.display = "none";
        message.innerHTML = "<p>Error de conexión. Inténtalo de nuevo.</p>";
        message.style.display = "block";
    }
}

// Controladores de eventos
cityInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchSuggestions(e.target.value);
    }, 300);
});

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
