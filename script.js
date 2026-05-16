const apiKey = "c32c3fcf40992f1a7289cd8f3b7206ca";

// Conexiones HTML
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const datalist = document.getElementById('ciudades-sugeridas');
const weatherData = document.getElementById('weather-data');
const message = document.getElementById('message');

const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

let debounceTimer;

// 1. FUNCIÓN PARA BUSCAR SUGERENCIAS EN TIEMPO REAL
async function fetchSuggestions(query) {
    if (query.length < 3) {
        datalist.innerHTML = ""; // No busca hasta que haya mínimo 3 letras
        return;
    }

    try {
        // Llamamos al motor de geolocalización de OpenWeather (trae hasta 5 coincidencias)
        const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
        const locations = await response.json();

        // Limpiamos sugerencias anteriores
        datalist.innerHTML = "";

        // Metemos las nuevas opciones encontradas en el datalist
        locations.forEach(location => {
            const option = document.createElement('option');
            // Formato sugerencia: "NombreCiudad, Estado/Provincia (País)"
            const state = location.state ? `, ${location.state}` : "";
            option.value = `${location.name}${state}, ${location.country}`;
            datalist.appendChild(option);
        });
    } catch (error) {
        console.error("Error buscando sugerencias:", error);
    }
}

// 2. FUNCIÓN PARA MOSTRAR EL CLIMA DE LA CIUDAD SELECCIONADA
async function checkWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );

        if (response.status === 404) {
            message.innerText = "Ciudad no encontrada. Revisa si está bien escrita.";
            weatherData.style.display = "none";
            return;
        }

        const data = await response.json();

        cityName.innerText = `${data.name}, ${data.sys.country}`;
        temp.innerText = Math.round(data.main.temp) + "°C";
        description.innerText = data.weather[0].description;
        humidity.innerText = data.main.humidity + "%";
        wind.innerText = data.wind.speed + " km/h";
        
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        message.style.display = "none";
        weatherData.style.display = "block";

    } catch (error) {
        console.error("Error al obtener datos:", error);
        message.innerText = "Error de conexión. Inténtalo de nuevo más tarde.";
    }
}

// EVENTO: Captura cuando el usuario escribe en el buscador (con Debounce de 300ms)
cityInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetchSuggestions(e.target.value);
    }, 300);
});

// EVENTO: Clic en botón buscar
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});

// EVENTO: Pulsar Enter
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});
