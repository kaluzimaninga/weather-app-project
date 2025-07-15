const form = document.getElementById('weatherForm');
const weatherDisplay = document.getElementById('weatherDisplay');
const cityInput = document.getElementById('city'); // Get the city input field

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const city = document.getElementById('city').value;
  const country = document.getElementById('country').value;

  // await fetchWeather(city, country); // Your current weather fetch function
  //await fetchForecast(city, country); // Fetch the forecast

  try {
    const response = await fetch(`http://localhost:3000/current-weather?city=${city}&country=${country}`);
    const data = await response.json();

    const weather = data.data && data.data.length > 0 ? data.data[0] : {};
    console.log(data); // Check the structure of the returned data in the console

    // Make sure the data structure is correct before accessing properties
    // if (data && data.weather && data.weather.description) {
    weatherDisplay.innerHTML = `
        <p>City: ${weather.city_name || 'Unknown'}, ${weather.country_code || 'Unknown'}</p>
        <p>Temperature: ${weather.app_temp}°C</p>
        <p>Feels like: ${weather.app_temp}°C</p>
        <p>Weather: ${weather.weather ? weather.weather.description : 'Unknown'}</p>
        <p>Humidity: ${weather.rh}%</p>
        <p>Wind Speed: ${weather.wind_spd} m/s</p>
        <p>Air Quality Index: ${weather.aqi}</p>
        <p>Timestamp: ${weather.ob_time || 'Unknown'}</p>
      `;
    // } else {
    // weatherDisplay.innerHTML = `<p>Weather data unavailable for the entered location.</p>`;
    // }

    // Save search history in localStorage
    saveSearchHistory(city);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherDisplay.innerHTML = `<p>Failed to retrieve weather data. Please try again later.</p>`;
  }

  ////fetching the 16-day forecast and logging it in the console
  try {
    const forecastResponse = await fetch(`http://localhost:3000/forecast?city=${city}&country=${country}`);
    const forecastData = await forecastResponse.json();


    console.log('16-day Forecast Data:', forecastData); // Log 16-day forecast data in the console

    // Display 16-day forecast (for now, just logging it; you can display it later)
    forecastDisplay.innerHTML = ''; // Clear previous forecast
    forecastData.data.forEach(day => {
      forecastDisplay.innerHTML += `
         <div>
           <p>Date: ${day.valid_date}</p>
           <p>Max Temp: ${day.max_temp}°C</p>
           <p>Min Temp: ${day.min_temp}°C</p>
           <p>Weather: ${day.weather ? day.weather.description : 'Unknown'}</p>
         </div>
         <hr>
       `;
    });

  }
  catch (error) {
    console.error('Error fetching forecast:', error);
    forecastDisplay.innerHTML = `<p>Failed to retrieve forecast data. Please try again later.</p>`;
  }

});

// Function to save city search history in localStorage
function saveSearchHistory(city) {
  let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

  if (!searchHistory.includes(city)) {
    searchHistory.push(city); // Add the new city to the list
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory)); // Save back to localStorage
  }
}

// Function to suggest history as autocomplete options
cityInput.addEventListener('input', () => {
  const searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
  const inputVal = cityInput.value.toLowerCase();
  const suggestions = searchHistory.filter(city => city.toLowerCase().startsWith(inputVal));

  showAutocompleteSuggestions(suggestions);
});

// Function to display autocomplete suggestions in a dropdown
function showAutocompleteSuggestions(suggestions) {
  const suggestionBox = document.getElementById('autocomplete-list');
  suggestionBox.innerHTML = ''; // Clear previous suggestions

  suggestions.forEach(suggestion => {
    const option = document.createElement('div');
    option.classList.add('autocomplete-item');
    option.innerText = suggestion;

    // When a user clicks a suggestion, it fills the input box
    option.addEventListener('click', () => {
      cityInput.value = suggestion;
      suggestionBox.innerHTML = ''; // Clear suggestions after selection
    });


    suggestionBox.appendChild(option); // Add each suggestion to the dropdown
  });
}