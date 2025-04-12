const apiKey = "c0106f4fef38c3060fe8b8893e5e29cf";

function checkWeather() {
    const city = document.getElementById('cityName').value.trim();
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    fetchWeatherData(city, 'weather', 'today');
    fetchWeatherData(city, 'forecast', 'hourly', 'tenDay');
}

function fetchWeatherData(city, type, sectionId, tenDaySection) {
    const url = `https://api.openweathermap.org/data/2.5/${type}?q=${city}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200 && data.cod !== "200") {
                alert("City not found!");
                return;
            }

            if (type === 'weather') {
                const iconCode = data.weather[0].icon;
                const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
                document.getElementById(sectionId).innerHTML = `
                    <h2>Today's Weather in ${city}</h2>
                    <p><img src="${iconUrl}" alt="Weather Icon"></p>
                    <p>${data.main.temp}&deg;C, ${data.weather[0].description}</p>
                    <p>Wind: ${data.wind.speed} km/h, Humidity: ${data.main.humidity}%</p>
                `;
            } else if (type === 'forecast') {
                updateForecastSections(data, sectionId, tenDaySection);
            }

            document.getElementById('weatherContainer').style.display = 'block';
        })
        .catch(() => alert("Failed to fetch weather data."));
}

function updateForecastSections(data, hourlySection, tenDaySection) {
    let hourlyHTML = '<h2>Hourly Forecast</h2>';
    for (let i = 0; i < 5; i++) {
        let forecast = data.list[i];
        let time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        hourlyHTML += `
            <p><strong>${time}:</strong> ${forecast.main.temp}&deg;C, ${forecast.weather[0].description}
            <img src="${iconUrl}" alt="Weather Icon"></p>
        `;
    }
    document.getElementById(hourlySection).innerHTML = hourlyHTML;

    let tenDayHTML = '<h2>10-Day Forecast</h2>';
    for (let i = 0; i < data.list.length; i += 8) {
        let forecast = data.list[i];
        let date = new Date(forecast.dt * 1000).toDateString();
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        tenDayHTML += `
            <p><strong>${date}:</strong> ${forecast.main.temp}&deg;C, ${forecast.weather[0].description}
            <img src="${iconUrl}" alt="Weather Icon"></p>
        `;
    }
    document.getElementById(tenDaySection).innerHTML = tenDayHTML;
}

function showSection(sectionId) {
    document.querySelectorAll('.weather-section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function home() {
    document.getElementById('weatherContainer').style.display = 'none';
}
