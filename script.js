// Tu llave maestra de OpenWeatherMap activa desde ayer
const apiKey = "c32c3fcf40992f1a7289cd8f3b7206ca";

// Conectamos los elementos de la interfaz HTML con JavaScript
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherData = document.getElementById('weather-data');
const message = document.getElementById('message');

const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temp = document.getElementById('temp');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

// Función asíncrona para pedir los datos a Internet
async function checkWeather(city) {
    try {
        // Hacemos la llamada a la API usando tu clave, pidiendo el idioma en español y unidades métricas (Celsius)
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`
        );

        // Si el servidor responde con un código 404 significa que la ciudad no existe
        if (response.status === 404) {
            message.innerText = "Ciudad no encontrada. Revisa si está bien escrita.";
            weatherData.style.display = "none";
            return;
        }

        // Transformamos la respuesta en un objeto que JavaScript entienda perfectamente (JSON)
        const data = await response.json();

        // Inyectamos los datos reales del servidor en nuestras etiquetas HTML
        cityName.innerText = data.name;
        temp.innerText = Math.round(data.main.temp) + "°C";
        description.innerText = data.weather[0].description;
        humidity.innerText = data.main.humidity + "%";
        wind.innerText = data.wind.speed + " km/h";
        
        // Obtenemos el código de icono que nos manda el servidor y armamos la URL de la imagen
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Ocultamos el mensaje de bienvenida y mostramos la tarjeta con toda la información
        message.style.display = "none";
        weatherData.style.display = "block";

    } catch (error) {
        // En caso de que se caiga internet o haya un problema de conexión grave
        console.error("Error al obtener datos:", error);
        message.innerText = "Error de conexión. Inténtalo de nuevo más tarde.";
    }
}

// Escuchador de eventos: Cuando el usuario hace clic en el botón "Buscar"
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});

// Escuchador de eventos: Por si el usuario prefiere pulsar la tecla "Enter" en vez de clicar
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== "") {
        checkWeather(cityInput.value);
    }
});
