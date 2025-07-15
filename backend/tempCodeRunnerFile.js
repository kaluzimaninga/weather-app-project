const fetch = require('node-fetch'); //importing node-fetch (no longer needed since you're using axios)
const express = require('express'); // Imports the Express library.
const axios = require('axios'); // Imports Axios for HTTP requests.
const dotenv = require('dotenv'); // For loading environment variables.
const cors = require('cors'); // For handling cross-origin requests.
const path = require('path'); // For correct pathing. We're gunna use this to reference where the files are.

dotenv.config(); // Loads the .env file content into process.env.

const app = express();
const PORT = process.env.PORT || 3000; // this is the port we are using
const apiKey = process.env.WEATHER_API_KEY; // referencing the API key in the .env file

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend'))); // Adjusting path since backend is in a different folder

// Current Weather Route
app.get('/current-weather', async (req, res) => {
    const { city, country } = req.query; // gets country and city from request query parameters
    try {
        const response = await axios.get(`https://api.weatherbit.io/v2.0/current`, {
            params: {
                city,
                country,
                key: apiKey // literally the API key
            }
        });
        res.json(response.data); // Sends the weather data back as a JSON response
    } catch (error) {
        console.error(error); // Log error for debugging.
        res.status(500).send('Error fetching weather data'); // Sends error response.
    }
});

// 16-day Weather Forecast Route
app.get('/forecast', async (req, res) => {
    const { city, country } = req.query; // Get city and country from the request query parameters
    try {
        const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily`, {
            params: {
                city,
                country,
                key: apiKey // Use the same API key
            }
        });

        console.log('16-day Forecast Data:', response.data); // Log forecast data on the backend side
        res.json(response.data); // Send the forecast data back as JSON response to the frontend
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        res.status(500).send('Error fetching forecast data'); // Send error response if there's an issue
    }
});

// Random port stuff to listen on the designated port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
