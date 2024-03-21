import React from 'react';

const WeatherCard = ({ weatherData }) => {
  return (
    <div className="card weather-info">
      <h2>Today's {weatherData.name} Weather</h2>
      <div className='weather-item'>
      <p>Temperature: {weatherData.main.temp} °C</p>
      <p>Weather: {weatherData.weather[0].description}</p>
      </div>
    </div>
  );
};

export default WeatherCard;

