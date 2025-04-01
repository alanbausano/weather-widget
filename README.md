# Weather Widget

A customizable weather widget that can be embedded in any website. The widget shows current weather conditions and a 7-day forecast for any city.

## Features

- Current weather conditions including temperature, humidity, and wind speed
- 7-day weather forecast with interactive carousel navigation
- Automatic geolocation support with fallback to specified city
- Toggle between light and dark themes
- Toggle between Celsius and Fahrenheit units
- Interactive forecast cards with detailed weather information
- Responsive design that works on all screen sizes
- Built with React and Radix UI
- Data caching and automatic updates (5-minute stale time)
- Error handling and loading states
- Customizable through simple configuration

## Installation

1. Download the latest version of the widget from the dist folder
2. Include the script in your HTML file

```html
<script src="path/to/weather-widget.js"></script>
```

## Usage

1. First, get your API key from [OpenWeather](https://openweathermap.org/api). You'll need to sign up for a free account.

2. Add the following code to your website where you want the widget to appear:

```html
<script>
  window.addEventListener("load", function () {
    const container = document.createElement("div");
    container.id = "widget-container";
    document.body.appendChild(container);

    if (window.Widget) {
      Widget.init({
        city: "your-city-name", // Optional if geolocation is available
        apiKey: "your-openweather-api-key", // Your OpenWeather API key
      });
    } else {
      console.error("Weather Widget not loaded");
    }
  });
</script>
```

## Configuration Options

The widget accepts the following configuration options:

- `city` (optional): Default city name. If not provided and geolocation is available, the widget will use the user's current location
- `apiKey` (required): Your OpenWeather API key

## Features in Detail

### Theme Support

The widget automatically adapts to light and dark themes, with a built-in theme toggle button. The theme preference is preserved across sessions.

### Temperature Units

Users can switch between Celsius and Fahrenheit units at any time using the unit toggle button.

### Weather Information

Each forecast card displays:

- Day and date
- Weather icon
- Temperature
- Weather description
- Humidity percentage
- Wind speed (in m/s)

### Interactive Carousel

- Navigate through the 7-day forecast using previous/next buttons
- Smooth animations when transitioning between days
- Responsive design that adapts to different screen sizes

## Development

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Build for production:

```bash
npm run build
```

## Security Note

When using this widget in production:

- Never expose your API key in client-side code
- Consider implementing a backend proxy to make API calls
- Or use environment-specific API keys (development vs production)
