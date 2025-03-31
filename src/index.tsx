import React from "react";
import { createRoot } from "react-dom/client";
import WeatherWidget from "./WeatherWidget";
import { WidgetConfig } from "./types";

declare global {
  interface Window {
    WIDGET_CONFIG?: WidgetConfig;
  }
}

let root: ReturnType<typeof createRoot> | null = null;

const init = (config: WidgetConfig) => {
  const container = document.getElementById("widget-container");
  if (!container) {
    console.error("Widget container not found");
    return;
  }

  // In development, use the environment variable if no API key is provided
  const apiKey = config.apiKey || process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("No API key provided");
    return;
  }

  // If we already have a root, just update it
  if (root) {
    root.render(<WeatherWidget city={config.city} apiKey={apiKey} />);
    return;
  }

  // Otherwise create a new root
  root = createRoot(container);
  root.render(<WeatherWidget city={config.city} apiKey={apiKey} />);
};

// Initialize in development mode
if (process.env.NODE_ENV === "development" && window.WIDGET_CONFIG) {
  init(window.WIDGET_CONFIG);
}

export { init };
