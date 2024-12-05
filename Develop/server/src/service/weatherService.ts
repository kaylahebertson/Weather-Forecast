import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  iconTag: string;
  constructor(
    city: string,
    date: string,
    temperature: number,
    humidity: number,
    windSpeed: number,
    icon: string,
    iconTag: string
  ) {
    this.city = city;
    this.date = date;
    this.temperature = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
    this.iconTag = iconTag;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {

  private baseURL: string= 'https://api.openweathermap.org/data/2.5/';
  private apiKey: string = process.env.WEATHER_API_KEY || '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}weather?q=${city}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery(city));
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { name } = response;
    const { dt, temp, humidity } = response.main;
    const { speed } = response.wind;
    const { icon } = response.weather[0];
    const iconTag = response.weather[0].description;
    return new Weather(name, dt, temp, humidity, speed, icon, iconTag);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = [];
    forecastArray.push(currentWeather);
    for (let i = 1; i < weatherData.length; i++) {
      const { dt, temp, humidity, wind_speed } = weatherData[i];
      const { icon } = weatherData[i].weather[0];
      const iconTag = weatherData[i].weather[0].description;
      forecastArray.push(new Weather(currentWeather.city, dt, temp, humidity, wind_speed, icon, iconTag));
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return forecastArray;
  }
}

export default new WeatherService();
