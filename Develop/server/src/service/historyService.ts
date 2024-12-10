import fs from 'node:fs/promises';

class City {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class HistoryService {
  private async read(): Promise<string> {
    try {
      const data = await fs.readFile('db/db.json', 'utf8');
      return data;
    } catch (error) {
      console.error('Error reading file:', error);
      throw error;
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile('db/db.json', JSON.stringify(cities));
    } catch (error) {
      console.error('Error writing file:', error);
      throw error;
    }
  }

    public async getCities(): Promise<City[]> {
      const data = await this.read();
      const parsedCities: City[] = JSON.parse(data);
      return parsedCities;
    }

    public async addCity(cityName: string): Promise<void> {
      const cities = await this.getCities();
      const newCity = new City(cities.length.toString(), cityName);
      cities.push(newCity);
      await this.write(cities);
    }
}

export default new HistoryService();
