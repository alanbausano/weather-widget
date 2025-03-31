import React, { useEffect, useState } from "react";
import { Theme } from "@radix-ui/themes";
import { SunIcon, MoonIcon, UpdateIcon } from "@radix-ui/react-icons";
import {
  WeatherData,
  DailyForecast,
  WidgetProps,
  TemperatureUnit,
} from "./types";
import "./WeatherWidget.css";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

const WeatherWidget: React.FC<WidgetProps> = ({ city, apiKey }) => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>("celsius");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const weatherResponse = await fetch(
        `${BASE_URL}/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      //   const forecastResponse = await fetch(
      //     `${BASE_URL}/forecast/weather?q=${city}&appid=${apiKey}&units=metric`
      //   );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const weatherData = await weatherResponse.json();
      // const forecastData = await forecastResponse.json();

      setCurrentWeather(weatherData);
      // setForecast(forecastData.list);
      setError(null);
    } catch (err) {
      setError(
        "Error fetching weather data. Please check your API key and city name."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city, apiKey]);

  const convertTemp = (temp: number): number => {
    if (unit === "fahrenheit") {
      return (temp * 9) / 5 + 32;
    }
    return temp;
  };

  const formatTemp = (temp: number): string => {
    const converted = convertTemp(temp);
    return `${Math.round(converted)}°${unit === "celsius" ? "C" : "F"}`;
  };

  if (loading) {
    return (
      <Theme>
        <div className="weather-widget loading">
          <UpdateIcon className="spin" />
          Loading weather data...
        </div>
      </Theme>
    );
  }

  if (error) {
    return (
      <Theme>
        <div className="weather-widget error">{error}</div>
      </Theme>
    );
  }

  return (
    <Theme>
      <div className="weather-widget">
        <div className="widget-header">
          <h2>{city}</h2>
          <button
            onClick={() =>
              setUnit(unit === "celsius" ? "fahrenheit" : "celsius")
            }
            className="unit-toggle"
          >
            Switch to {unit === "celsius" ? "°F" : "°C"}
          </button>
        </div>

        {currentWeather && (
          <div className="current-weather">
            <div className="temp-display">
              <img
                src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                alt={currentWeather.weather[0].description}
              />
              <span className="temperature">
                {formatTemp(currentWeather.main.temp)}
              </span>
            </div>
            <div className="weather-details">
              <p>Feels like: {formatTemp(currentWeather.main.feels_like)}</p>
              <p>Humidity: {currentWeather.main.humidity}%</p>
              <p>Wind: {Math.round(currentWeather.wind.speed)} m/s</p>
            </div>
          </div>
        )}

        {/* <div className="forecast">
          {forecast.map((day, index) => (
            <div
              key={day.dt}
              className={`forecast-day ${
                selectedDay === index ? "selected" : ""
              }`}
              onClick={() =>
                setSelectedDay(selectedDay === index ? null : index)
              }
            >
              <div className="day-name">
                {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>
              <img
                src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                alt={day.weather[0].description}
              />
              <div className="day-temp">
                <span className="max">{formatTemp(day.temp.max)}</span>
                <span className="min">{formatTemp(day.temp.min)}</span>
              </div>
              {selectedDay === index && (
                <div className="day-details">
                  <p>{day.weather[0].description}</p>
                </div>
              )}
            </div>
          ))}
        </div> */}

        <button onClick={fetchWeatherData} className="refresh-button">
          <UpdateIcon /> Refresh
        </button>
      </div>
    </Theme>
  );
};

export default WeatherWidget;
