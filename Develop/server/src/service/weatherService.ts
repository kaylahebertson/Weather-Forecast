import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  latitude: number;
  longitutde: number;
}
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
class WeatherService {

  private baseURL: string= process.env.WEATHER_API_URL || '';
  private apiKey: string = process.env.WEATHER_API_KEY || '';

  private async fetchLocationData(query: string) {
    const response: Coordinates[] = await fetch(query).then((response) => response.json());
    return response[0];
  }

  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { latitude, longitutde } = locationData;
    const coordinates = { latitude, longitutde };
    return coordinates;
  }

  private buildGeocodeQuery(city: string): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${city}&limit=1&appid=${this.apiKey}`;
    return geocodeQuery;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitutde}&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }

  private async fetchAndDestructureLocationData(city: string) {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery(city));
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const data = await response.json();
    return data;
  }

  private parseCurrentWeather(response: any) {
    const currentWeather = new Weather(
      response.city,
      response.dt,
      response.temp,
      response.humidity,
      response.speed,
      response.icon,
      response.iconTag
    );
    return currentWeather;
  }

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

  async getWeatherForCity(city: string) {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return forecastArray;
  }
}

export default new WeatherService();
