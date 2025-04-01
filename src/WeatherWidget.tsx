import React from "react";
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
  MoonIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import { motion, AnimatePresence } from "framer-motion";
import { WidgetProps } from "./types";
import { useWeatherData } from "./hooks/useWeatherData";
import { useWeatherCarousel } from "./hooks/useWeatherCarousel";
import { useTheme } from "./hooks/useTheme";
import { formatDate } from "./utils/dateUtils";
import "./WeatherWidget.css";

const WeatherWidget: React.FC<WidgetProps> = ({
  city: initialCity,
  apiKey,
}) => {
  const {
    currentWeather,
    forecast,
    isLoading,
    isError,
    error: weatherError,
    unit,
    setUnit,
    formatTemp,
  } = useWeatherData(initialCity, apiKey);

  const { theme, toggleTheme } = useTheme();
  const { handlePrevious, handleNext, getVisibleDays } =
    useWeatherCarousel(forecast);

  if (isLoading) {
    return (
      <Theme appearance={theme}>
        <Container className="weather-widget" data-theme={theme}>
          <Flex align="center" justify="center" style={{ minHeight: "400px" }}>
            <Text size="5">Loading weather data...</Text>
          </Flex>
        </Container>
      </Theme>
    );
  }

  if (isError) {
    return (
      <Theme appearance={theme}>
        <Container className="weather-widget error" data-theme={theme}>
          <Text color="red">
            {weatherError instanceof Error
              ? weatherError.message
              : "Error fetching weather data. Please check your API key and city name."}
          </Text>
        </Container>
      </Theme>
    );
  }

  return (
    <Theme appearance={theme} accentColor="blue" radius="large" scaling="95%">
      <Container className="weather-widget" data-theme={theme}>
        <Flex justify="between" align="center" className="widget-header">
          <Heading size="8" weight="bold" className="city-title" mb="0">
            {currentWeather?.name || initialCity}
          </Heading>
          <Flex gap="3">
            <Button onClick={toggleTheme} size="3" variant="soft">
              {theme === "light" ? (
                <MoonIcon width="16" height="16" />
              ) : (
                <SunIcon width="16" height="16" />
              )}
            </Button>
            <Button
              onClick={() =>
                setUnit(unit === "celsius" ? "fahrenheit" : "celsius")
              }
              size="3"
              variant="solid"
            >
              Switch to {unit === "celsius" ? "°F" : "°C"}
            </Button>
          </Flex>
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
