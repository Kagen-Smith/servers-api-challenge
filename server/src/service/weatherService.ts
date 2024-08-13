import dotenv from 'dotenv';
dotenv.config();

const baseURL: string = process.env.API_BASE_URL! || '';
const apiKey: string = process.env.API_KEY! || ' ';

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
interface WeatherObject {
  city: string;
  temp: number;
  wind: number;
  humidity: number;
  description: string;
  icon: string;
  date: string;
}
class Weather {
  city: string;
  temp: number;
  wind: number;
  humidity: number;
  description: string;
  icon: string;
  date: string;

  constructor(weatherObject: WeatherObject) {
    this.city = weatherObject.city;
    this.temp = weatherObject.temp;
    this.wind = weatherObject.wind;
    this.humidity = weatherObject.humidity;
    this.description = weatherObject.description;
    this.icon = weatherObject.icon;
    this.date = weatherObject.date;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties  
  private baseURL?: string;
  private apiKey?: string;
  private name?: string;

  constructor(baseURL: string, apiKey: string, name: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.name = name;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();

    if (data.length === 0) {
      throw new Error('No location found');
    }

    const locationData = data[0];

    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create destructureLocationData method
  private async destructureLocationData(locationData: Coordinates): Promise<Coordinates> {
    const { lat, lon } = locationData;
    return { lat, lon };
  }

  // TODO: Create buildGeocodeQuery method
  private async buildGeocodeQuery(): Promise<string> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${this.name}&limit=1&appid=${this.apiKey}`); ``
    const data = await response.json();
    const locationData = data[0];
    const { lat, lon } = locationData;
    return `${lat},${lon}`;
  }
  // TODO: Create buildWeatherQuery method
  private async buildWeatherQuery(coordinates: Coordinates): Promise<string> {
    const { lat, lon } = coordinates;
    return `${lat},${lon}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(name);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather> {
    const query = await this.buildWeatherQuery(coordinates);
    const response = await fetch(`${this.baseURL}/data/2.5/weather?${query}&appid=${this.apiKey}`);
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { temp, wind, humidity, description, icon } = response;
    const date = new Date().toISOString();
    return new Weather(temp, wind, humidity, description, icon, date);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: WeatherData, weatherData: any[]): Weather[] {
    console.log('Building forecast array:' weatherData);
    return new Weather({
      city: currentWeather.city,
      date: entry.dt_txt,
      icon: entry
    })
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const locationData = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(locationData);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.list || []);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService(baseURL, apiKey, name);