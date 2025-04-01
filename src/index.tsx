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

interface WidgetConfig {
  city: string;
  apiKey: string;
}

class WidgetInitializer {
  private root: any = null;

  init(config: WidgetConfig) {
    const container = document.getElementById("widget-container");
    if (!container) {
      throw new Error(
        'Widget container not found. Please ensure a div with id "widget-container" exists.'
      );
    }

    // Clean up any existing instance
    if (this.root) {
      this.root.unmount();
    }

    this.root = createRoot(container);
    this.root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <WeatherWidget city={config.city} apiKey={config.apiKey} />
        </QueryClientProvider>
      </React.StrictMode>
    );
  }
}

// Export the Widget object to the window
const Widget = new WidgetInitializer();
export { Widget };

// Make Widget available globally
declare global {
  interface Window {
    Widget: typeof Widget;
  }
}
window.Widget = Widget;
