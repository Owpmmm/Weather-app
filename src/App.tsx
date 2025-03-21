import { useState } from 'react';
import './App.css';

interface WeatherData {
  main: { 
    temp: number; 
    feels_like: number;
    humidity: number;
  };
  weather: { 
    description: string;
    icon: string;
  }[];
  wind: { 
    speed: number;
  };
  name: string;
  sys: { 
    country: string; 
  };
}


function App() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }
    
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('City not found');
      }
  
      const data: WeatherData = await response.json();
      setWeather(data);
      setError(null);
    } catch (err) {
      setWeather(null);
      setError('City not found. Please try again.');
    }
  };
  

  return (
    <div>
      <h1>Weather App</h1>

      <div>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      <div className="weather-info">
  {error && <p style={{ color: 'red' }}>{error}</p>}

  {weather && (
    <div>
      <h2>
        {weather.name}, {weather.sys.country}
      </h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <p>Feels Like: {weather.main.feels_like}°C</p>
      <p>Humidity: {weather.main.humidity}%</p>
      <p>Wind Speed: {weather.wind.speed} m/s</p>
      <p>Condition: {weather.weather[0].description}</p>

      {/* Weather Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
        alt="Weather Icon"
      />
    </div>
  )}
</div>
    </div>
  );
}

export default App;
