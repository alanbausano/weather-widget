import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WeatherWidget from "./WeatherWidget";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
      gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const apiKey = process.env.WEATHER_API_KEY;
if (!apiKey) {
  throw new Error(
    "Weather API key is not configured. Please check your .env file."
  );
}

// For development, you can replace these with your own values
const defaultConfig = {
  city: "London",
  apiKey, // Use the API key directly
};

// Debug: Check configuration
console.log("Config:", {
  city: defaultConfig.city,
  apiKeyLength: defaultConfig.apiKey?.length,
  apiKeyStart: defaultConfig.apiKey?.substring(0, 4),
});

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WeatherWidget city={defaultConfig.city} apiKey={defaultConfig.apiKey} />
    </QueryClientProvider>
  </React.StrictMode>
);
