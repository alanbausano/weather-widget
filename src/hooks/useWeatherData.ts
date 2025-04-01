import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "../services/weatherApi";
import { TemperatureUnit } from "../types";

type Location = string | { lat: number; lon: number };

export const useWeatherData = (initialCity: string, apiKey: string) => {
  const [location, setLocation] = useState<Location>(initialCity);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [unit, setUnit] = useState<TemperatureUnit>("celsius");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation(initialCity);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setLocation(initialCity);
      setIsLoadingLocation(false);
    }
  }, [initialCity]);

  const {
    data: currentWeather,
    isLoading: isLoadingWeather,
    isError: isErrorWeather,
    error: weatherError,
  } = useQuery({
    queryKey: ["weather", location],
    queryFn: () => weatherApi.fetchWeather(location, apiKey),
    enabled: !isLoadingLocation,
  });

  const {
    data: forecast,
    isLoading: isLoadingForecast,
    isError: isErrorForecast,
  } = useQuery({
    queryKey: ["forecast", location],
    queryFn: () => weatherApi.fetchForecast(location, apiKey),
    enabled: !isLoadingLocation,
  });

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

  return {
    currentWeather,
    forecast,
    isLoading: isLoadingLocation || isLoadingWeather || isLoadingForecast,
    isError: isErrorWeather || isErrorForecast,
    error: weatherError,
    unit,
    setUnit,
    formatTemp,
  };
};
