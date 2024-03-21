import React from 'react';

const ForecastCard = ({ forecastData }) => {
  // Extracting unique dates from forecastData list
  const uniqueDates = [...new Set(forecastData.list.map(item => new Date(item.dt * 1000).toLocaleDateString()))];

  return (
    <>
      <h2>Weather Forecast for {forecastData.city.name}</h2>
      <div className="card forecast-info">
        {uniqueDates.map((date, index) => (
          <div key={index} className="forecast-item">
            <p>Date: {date}</p>
            {/* Display data for the first occurrence of each date */}
            {forecastData.list.find(item => new Date(item.dt * 1000).toLocaleDateString() === date) && (
              <>
                <p>Temperature: {forecastData.list.find(item => new Date(item.dt * 1000).toLocaleDateString() === date).main.temp} °C</p>
                <p>Weather: {forecastData.list.find(item => new Date(item.dt * 1000).toLocaleDateString() === date).weather[0].description}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ForecastCard;


