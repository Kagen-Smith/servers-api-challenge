import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

const baseURL: string = process.env.API_BASE_URL! || `https://api.openweathermap.org`
const apiKey: string =  process.env.API_KEY! || "d6e209a4939923e24d5d9b282dd40ca9";
const name = " ";
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  wind: number;
  humidity: number;
  description: string;
  icon: string;
  date: string;

  constructor(temp: number, wind: number, humidity: number, description: string, icon: string, date: string) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
    this.description = description;
    this.icon = icon;
    this.date = date;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private name?: string;

  cosntructor(baseURL: string, apiKey: string, name: string) {
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
    
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
