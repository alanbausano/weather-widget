import { WeatherData, ForecastData } from "../types";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

type LocationParam = string | { lat: number; lon: number };

export const weatherApi = {
  fetchWeather: async (
    location: LocationParam,
    apiKey: string
  ): Promise<WeatherData> => {
    const url =
      typeof location === "string"
        ? `${BASE_URL}/weather?q=${location}&appid=${apiKey}&units=metric`
        : `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch weather data: ${errorText}`);
    }

    return response.json();
  },

  fetchForecast: async (
    location: LocationParam,
    apiKey: string
  ): Promise<ForecastData> => {
    const url =
      typeof location === "string"
        ? `${BASE_URL}/forecast?q=${location}&appid=${apiKey}&units=metric`
        : `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch forecast data: ${errorText}`);
    }

    return response.json();
  },
};
