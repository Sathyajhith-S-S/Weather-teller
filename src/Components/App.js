import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './WeatherCard'; // Importing the WeatherCard compo
import ForecastCard from './ForecastCard'; // Importing the ForecastCard component

const App = () => {
  const [weatherData, setWeatherData] = useState(null); // State for storing weather data
  const [forecastData, setForecastData] = useState(null); // State for storing forecast data
  const [location, setLocation] = useState(''); // State for user-entered location
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY; // API key for OpenWeatherMap API

  // Function to fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (placeName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${placeName}&units=metric&appid=${apiKey}`
      );
      setWeatherData(response.data); // Set weather data in state
    } catch (error) {
      setError('Error fetching weather data. Please try again.'); // Handle error if API request fails
    }
  };

  // Function to fetch forecast data from OpenWeatherMap API
  const fetchForecastData = async (placeName) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${placeName}&units=metric&appid=${apiKey}`
      );
      setForecastData(response.data); // Set forecast data in state
    } catch (error) {
      setError('Error fetching forecast data. Please try again.'); // Handle error if API request fails
    }
  };

  // Function to handle form submission and fetch weather and forecast data
  const handleSubmit = async () => {
    setLoading(true); // Set loading status to true
    setError(null); // Clear any previous errors

    try {
      await fetchWeatherData(location); // Fetch weather data
      await fetchForecastData(location); // Fetch forecast data
    } catch (error) {
      setError('Error fetching data. Please try again.'); // Handle error if data fetching fails
    } finally {
      setLoading(false); // Set loading status to false after data fetching is complete
    }

    setLocation(''); // Clear the input field after submission
  };

  // Function to auto-detect user's location using geolocation API
  const handleAutoDetect = () => {
    setLoading(true); // Set loading status to true
    setError(null); // Clear any previous errors

    // Use navigator.geolocation.getCurrentPosition to get user's current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords; // Extract latitude and longitude from position
        // Reverse geocoding to get location name from latitude and longitude using OpenWeatherMap API
        axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`)
          .then((response) => {
            const placeName = response.data[0].name; // Extract location name from API response
            setLocation(placeName); // Set the location in state
            fetchWeatherData(placeName); // Fetch weather data for auto-detected location
            fetchForecastData(placeName); // Fetch forecast data for auto-detected location
            setLoading(false); // Set loading status to false after data fetching is complete
          })
          .catch((error) => {
            setError('Error detecting your location. Please try again or enter manually.'); // Handle error if location detection fails
            setLoading(false); // Set loading status to false
          });
      },
      () => {
        setError('Error detecting your location. Please try again or enter manually.'); // Handle error if geolocation fails
        setLoading(false); // Set loading status to false
      }
    );
  };

  // useEffect hook to automatically fetch weather data on component mount
  useEffect(() => {
    handleAutoDetect(); // Call handleAutoDetect function on component mount
  }, []); // Empty dependency array ensures this effect runs only once after component mount

  return (
    <div className="container">
      <h1 className="title">Weather App</h1>
      <div className="location-controls">
        <input
          type="text"
          value={location}
          placeholder="Enter location (e.g., London)"
          onChange={(e) => setLocation(e.target.value)}
          className="input"
        />
        <button onClick={handleSubmit} className="button">
          Get Weather
        </button>
        <button onClick={handleAutoDetect} className="button">
          Auto Detect Location
        </button>
      </div>
      {loading && <p>Loading...</p>} {/* Display loading message if data is being fetched */}
      {error && <p className="error">{error}</p>} {/* Display error message if any */}
      {weatherData && <WeatherCard weatherData={weatherData} />} {/* Render WeatherCard component if weather data is available */}
      <div className='forecastDiv'>
        {forecastData && <ForecastCard forecastData={forecastData} />} {/* Render ForecastCard component if forecast data is available */}
      </div>
    </div>
  );
};

export default App;
