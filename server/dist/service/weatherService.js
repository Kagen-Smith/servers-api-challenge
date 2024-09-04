import dotenv from 'dotenv';
dotenv.config();
const baseURL = process.env.API_BASE_URL || '';
const apiKey = process.env.API_KEY || '';
class Weather {
    constructor(weatherData) {
        this.city = weatherData.city;
        this.date = new Date(weatherData.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        this.icon = weatherData.icon;
        this.iconDescription = weatherData.iconDescription;
        this.tempF = parseFloat(((weatherData.tempF - 273.15) * 9 / 5 + 32).toFixed(2));
        this.humidity = weatherData.humidity;
        this.windSpeed = weatherData.windSpeed;
    }
}
class WeatherService {
    constructor(baseURL, apiKey) {
        this.cityName = null; // Initialize as null or an empty string
        this.baseURL = baseURL;
        this.apiKey = apiKey;
    }
    async fetchLocationData(query) {
        try {
            console.log('Fetching location data with query:', query);
            const response = await fetch(query);
            if (!response.ok) {
                throw new Error(`Location data fetch failed: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Location data:', data);
            if (!data || data.length === 0) {
                throw new Error('No location found');
            }
            const locationData = data[0];
            return {
                lat: locationData.lat,
                lon: locationData.lon,
            };
        }
        catch (error) {
            console.error('Error fetching location data:', error);
            throw error;
        }
    }
    buildGeocodeQuery() {
        if (!this.cityName) {
            throw new Error("City name is not set");
        }
        const query = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
        console.log('Geocode query:', query);
        return query;
    }
    buildWeatherQuery(coordinates) {
        const { lat, lon } = coordinates;
        return `lat=${lat}&lon=${lon}`;
    }
    async fetchAndDestructureLocationData() {
        if (!this.cityName) {
            throw new Error("City name is undefined");
        }
        const geocodeQuery = this.buildGeocodeQuery();
        return this.fetchLocationData(geocodeQuery);
    }
    async fetchWeatherData(coordinates) {
        try {
            const query = this.buildWeatherQuery(coordinates);
            const response = await fetch(`${this.baseURL}/data/2.5/forecast?${query}&appid=${this.apiKey}`);
            if (!response.ok) {
                throw new Error(`Weather data fetch failed: ${response.statusText}`);
            }
            const weatherData = await response.json();
            console.log('Weather data:', weatherData);
            return weatherData;
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }
    parseCurrentWeather(response) {
        const firstEntry = response.list[0];
        return {
            city: response.city.name,
            date: new Date(firstEntry.dt * 1000).toLocaleString(),
            icon: firstEntry.weather[0].icon,
            iconDescription: firstEntry.weather[0].description,
            tempF: firstEntry.main.temp,
            humidity: firstEntry.main.humidity,
            windSpeed: firstEntry.wind.speed
        };
    }
    buildForecastArray(currentWeather, weatherData) {
        console.log('Building forecast array with data:', weatherData);
        return weatherData
            .filter((entry) => entry.dt_txt.endsWith(' 12:00:00')) // Filter entries to only include 12:00:00
            .map((entry) => {
            return new Weather({
                city: currentWeather.city, // Use city from currentWeather
                date: entry.dt_txt,
                icon: entry.weather[0].icon,
                iconDescription: entry.weather[0].description,
                tempF: entry.main.temp,
                humidity: entry.main.humidity,
                windSpeed: entry.wind.speed,
            });
        });
    }
    async getWeatherForCity(city) {
        this.cityName = city; // Set cityName here
        try {
            console.log('City name set to:', this.cityName); // Debug: Verify the city name is set
            const coordinates = await this.fetchAndDestructureLocationData();
            console.log('Coordinates fetched:', coordinates);
            const weatherData = await this.fetchWeatherData(coordinates);
            console.log('Weather data fetched:', weatherData);
            const currentWeather = this.parseCurrentWeather(weatherData);
            console.log('Current weather parsed:', currentWeather);
            const forecastArray = this.buildForecastArray(currentWeather, weatherData.list);
            console.log('Forecast array built:', forecastArray);
            return [new Weather(currentWeather), ...forecastArray];
        }
        catch (error) {
            console.error('Error getting weather for city:', error);
            throw error;
        }
    }
}
// Instantiate the WeatherService without `name` as a parameter
const weatherService = new WeatherService(baseURL, apiKey);
export default weatherService;
