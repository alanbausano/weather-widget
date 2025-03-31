# Weather Widget

A customizable weather widget that can be embedded in any website. The widget shows current weather conditions and a 7-day forecast for any city.

## Features

- Current weather conditions including temperature, humidity, and wind speed
- 7-day weather forecast
- Toggle between Celsius and Fahrenheit
- Interactive forecast days with detailed information
- Responsive design that works on all screen sizes
- Built with React and Radix UI

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
        city: "your-city-name", // e.g., 'London', 'San Francisco', 'Buenos Aires'
        apiKey: "your-openweather-api-key", // Your OpenWeather API key
      });
    } else {
      console.error("Weather Widget not loaded");
    }
  });
</script>
```

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

## License

ISC
