import React, { useState, useEffect } from "react";
import "@radix-ui/themes/styles.css";
import {
  Theme,
  Card,
  Text,
  Button,
  Flex,
  Box,
  Container,
  Heading,
} from "@radix-ui/themes";
import {
  SunIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  WeatherData,
  ForecastData,
  WidgetProps,
  TemperatureUnit,
} from "./types";
import "./WeatherWidget.css";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

const fetchWeatherData = async (
  city: string | { lat: number; lon: number },
  apiKey: string
): Promise<WeatherData> => {
  console.log("Using API key:", apiKey);

  const url =
    typeof city === "string"
      ? `${BASE_URL}/weather?q=${city}&appid=${apiKey}&units=metric`
      : `${BASE_URL}/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;

  console.log("Fetching weather from:", url);

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Weather API Error:", errorText);
    throw new Error(`Failed to fetch weather data: ${errorText}`);
  }

  return response.json();
};

const fetchForecastData = async (
  city: string | { lat: number; lon: number },
  apiKey: string
): Promise<ForecastData> => {
  const url =
    typeof city === "string"
      ? `${BASE_URL}/forecast?q=${city}&appid=${apiKey}&units=metric`
      : `${BASE_URL}/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Forecast API Error:", errorText);
    throw new Error(`Failed to fetch forecast data: ${errorText}`);
  }

  return response.json();
};

const WeatherWidget: React.FC<WidgetProps> = ({
  city: initialCity,
  apiKey,
}) => {
  console.log("Widget Props:", { initialCity, apiKey });

  const [unit, setUnit] = useState<TemperatureUnit>("celsius");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [location, setLocation] = useState<
    string | { lat: number; lon: number }
  >(initialCity);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

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
    queryFn: () => fetchWeatherData(location, apiKey),
    enabled: !isLoadingLocation,
  });

  const {
    data: forecast,
    isLoading: isLoadingForecast,
    isError: isErrorForecast,
  } = useQuery({
    queryKey: ["forecast", location],
    queryFn: () => fetchForecastData(location, apiKey),
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const numeric = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "numeric",
    });
    return { day, numeric };
  };

  // Group forecast by day and get the middle reading of each day
  const getDailyForecasts = () => {
    if (!forecast) return [];

    const dailyReadings: { [key: string]: any[] } = {};

    forecast.list.forEach((reading) => {
      const date = reading.dt_txt.split(" ")[0];
      if (!dailyReadings[date]) {
        dailyReadings[date] = [];
      }
      dailyReadings[date].push(reading);
    });

    return Object.values(dailyReadings)
      .map((readings) => readings[Math.floor(readings.length / 2)])
      .slice(0, 7); // Get only 7 days
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : dailyForecasts.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < dailyForecasts.length - 1 ? prev + 1 : 0
    );
  };

  const getVisibleDays = () => {
    if (!dailyForecasts.length) return [];

    const lastIndex = dailyForecasts.length - 1;
    const prev = currentIndex === 0 ? lastIndex : currentIndex - 1;
    const next = currentIndex === lastIndex ? 0 : currentIndex + 1;

    return [
      { day: dailyForecasts[prev], position: "previous" },
      { day: dailyForecasts[currentIndex], position: "current" },
      { day: dailyForecasts[next], position: "next" },
    ];
  };

  if (isLoadingLocation || isLoadingWeather || isLoadingForecast) {
    return (
      <Theme>
        <Container className="weather-widget">
          <Flex align="center" justify="center" style={{ minHeight: "400px" }}>
            <Text size="5">Loading weather data...</Text>
          </Flex>
        </Container>
      </Theme>
    );
  }

  if (isErrorWeather || isErrorForecast) {
    return (
      <Theme>
        <Container className="weather-widget error">
          <Text color="red">
            {weatherError instanceof Error
              ? weatherError.message
              : "Error fetching weather data. Please check your API key and city name."}
          </Text>
        </Container>
      </Theme>
    );
  }

  const dailyForecasts = getDailyForecasts();

  return (
    <Theme appearance="light" accentColor="blue" radius="large" scaling="95%">
      <Container className="weather-widget">
        <Flex justify="between" align="center" className="widget-header">
          <Heading size="8" weight="bold" className="city-title" mb="0">
            {currentWeather?.name || initialCity}
          </Heading>
          <Button
            onClick={() =>
              setUnit(unit === "celsius" ? "fahrenheit" : "celsius")
            }
            size="3"
            variant="solid"
          >
            <SunIcon width="16" height="16" />
            Switch to {unit === "celsius" ? "°F" : "°C"}
          </Button>
        </Flex>

        <Box className="carousel-container">
          <Flex align="center" gap="4" className="carousel-content">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              className="carousel-button"
            >
              <ChevronLeftIcon width="24" height="24" />
            </Button>

            <Flex className="cards-container">
              <AnimatePresence mode="wait">
                {getVisibleDays().map(({ day, position }) => (
                  <motion.div
                    key={day.dt}
                    className={`card-wrapper ${position}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: position === "current" ? 1 : 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="forecast-card">
                      <Box className="day-date">
                        <Text size="6" weight="bold">
                          {formatDate(day.dt_txt).day}
                        </Text>
                        <Text className="date-numeric">
                          {formatDate(day.dt_txt).numeric}
                        </Text>
                      </Box>
                      <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        gap="4"
                        className="temp-display"
                      >
                        <img
                          src={`http://openweathermap.org/img/w/${day.weather[0].icon}.png`}
                          alt={day.weather[0].description}
                          className="weather-icon"
                        />
                        <motion.div
                          key={`${day.dt}-${unit}`}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        >
                          <Text size="8" weight="bold" className="temperature">
                            {formatTemp(day.main.temp)}
                          </Text>
                        </motion.div>
                      </Flex>
                      <Text
                        size="4"
                        color="gray"
                        className="weather-description"
                      >
                        {day.weather[0].description}
                      </Text>
                      <Box className="weather-details">
                        <Flex align="center" justify="center" gap="3" mb="3">
                          <WiHumidity
                            size={24}
                            className="weather-icon-small"
                          />
                          <Text as="p" size="4">
                            {day.main.humidity}%
                          </Text>
                        </Flex>
                        <Flex align="center" justify="center" gap="3">
                          <WiStrongWind
                            size={24}
                            className="weather-icon-small"
                          />
                          <Text as="p" size="4">
                            {Math.round(day.wind.speed)} m/s
                          </Text>
                        </Flex>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Flex>

            <Button
              variant="ghost"
              onClick={handleNext}
              className="carousel-button"
            >
              <ChevronRightIcon width="24" height="24" />
            </Button>
          </Flex>
        </Box>
      </Container>
    </Theme>
  );
};

export default WeatherWidget;
