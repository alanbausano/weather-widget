import { useState } from "react";
import { ForecastData } from "../types";

export const useWeatherCarousel = (forecast: ForecastData | undefined) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
      .slice(0, 7);
  };

  const handlePrevious = () => {
    const dailyForecasts = getDailyForecasts();
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : dailyForecasts.length - 1
    );
  };

  const handleNext = () => {
    const dailyForecasts = getDailyForecasts();
    setCurrentIndex((prev) =>
      prev < dailyForecasts.length - 1 ? prev + 1 : 0
    );
  };

  const getVisibleDays = () => {
    const dailyForecasts = getDailyForecasts();
    if (!dailyForecasts.length) return [];

    const lastIndex = dailyForecasts.length - 1;
    const prev = currentIndex === 0 ? lastIndex : currentIndex - 1;
    const next = currentIndex === lastIndex ? 0 : currentIndex + 1;

    return [
      { day: dailyForecasts[prev], position: "previous" as const },
      { day: dailyForecasts[currentIndex], position: "current" as const },
      { day: dailyForecasts[next], position: "next" as const },
    ];
  };

  return {
    handlePrevious,
    handleNext,
    getVisibleDays,
  };
};
