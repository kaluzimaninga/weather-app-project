const form = document.getElementById('weatherForm');
const weatherDisplay = document.getElementById('weatherDisplay');
const forecastDisplay = document.getElementById('forecastDisplay');
const cityInput = document.getElementById('city');

// Handle form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
//
  const city = cityInput.value.trim();
  const country = document.getElementById('country').value.trim();// Get country input value

  if (!city || !country) { // Check if both city and country are provided
    weatherDisplay.innerHTML = '<p>Please enter both city and country.</p>';
    return;
  }

  // Fetch current weather
  try {
    const response = await fetch(`http://localhost:3000/current-weather?city=${city}&country=${country}`); // Fetch current weather data from the backend
    const data = await response.json();

    const weather = data.data && data.data.length > 0 ? data.data[0] : null;

    // Display current weather data
    if (weather) {
      weatherDisplay.innerHTML = `
        <p><strong>City:</strong> ${weather.city_name || 'Unknown'}, ${weather.country_code || 'Unknown'}</p>
        <p><strong>Temperature:</strong> ${weather.temp}°C</p>
        <p><strong>Feels Like:</strong> ${weather.app_temp}°C</p>
        <p><strong>Weather:</strong> ${weather.weather?.description || 'Unknown'}</p>
        <p><strong>Humidity:</strong> ${weather.rh}%</p>
        <p><strong>Wind Speed:</strong> ${weather.wind_spd} m/s</p>
        <p><strong>Air Quality Index:</strong> ${weather.aqi}</p>
        <p><strong>Timestamp:</strong> ${weather.datetime || 'Unknown'}</p>
      `;
    } else {
      weatherDisplay.innerHTML = `<p>Weather data unavailable for "${city}, ${country}".</p>`;
    }

// Save search history
    saveSearchHistory(city);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherDisplay.innerHTML = `<p>Failed to retrieve weather data. Please try again later.</p>`;
  }

  // Fetchin 16-day forecast
  try {
    const forecastResponse = await fetch(`http://localhost:3000/forecast?city=${city}&country=${country}`);
    const forecastData = await forecastResponse.json(); // Fetch forecast data from the backend

    forecastDisplay.innerHTML = ''; // Clear previous forecast

    // Display forecast data
    if (forecastData.data && forecastData.data.length > 0) {
      forecastData.data.forEach(day => {
        forecastDisplay.innerHTML += `
          <div class="forecast-day">
            <p><strong>Date:</strong> ${day.valid_date}</p>
            <p><strong>Max Temp:</strong> ${day.max_temp}°C</p>
            <p><strong>Min Temp:</strong> ${day.min_temp}°C</p>
            <p><strong>Weather:</strong> ${day.weather?.description || 'Unknown'}</p>
          </div>
          <hr>
        `;
      });
    } else {
      forecastDisplay.innerHTML = `<p>No forecast data available.</p>`;
    }
  } catch (error) {
    console.error('Error fetching forecast:', error);
    forecastDisplay.innerHTML = `<p>Failed to retrieve forecast data. Please try again later.</p>`;
  }
});

// Save search history in localStorage
function saveSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
  }
}

// Autocomplete suggestions
cityInput.addEventListener('input', () => {
  const searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
  const inputVal = cityInput.value.toLowerCase();
  const suggestions = searchHistory.filter(city => city.toLowerCase().startsWith(inputVal));

  showAutocompleteSuggestions(suggestions);
});

// Show autocomplete suggestions
function showAutocompleteSuggestions(suggestions) {
  const suggestionBox = document.getElementById('autocomplete-list');
  suggestionBox.innerHTML = '';

  suggestions.forEach(suggestion => {
    const option = document.createElement('div');
    option.classList.add('autocomplete-item');
    option.innerText = suggestion;
    option.addEventListener('click', () => {
      cityInput.value = suggestion;
      suggestionBox.innerHTML = '';
    });

    suggestionBox.appendChild(option);
  });
}
