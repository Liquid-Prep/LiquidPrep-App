export class WeatherInfo {
  public narrative: string;
  public precipChance: number;
  public precipType: string;
  public precipitaion: number;
  public humidity: number;
  public uvIndex: number;
  public temperature: number;
  public windSpeed: number;
  public iconCode: number;
  public iconImageUrl: string;
  public temperatureMax: number;
  public temperatureMin: number;
}

export class TodayWeather {
  public dayOfWeek: string;
  public narrative: string;
  public sunriseTime: Date;
  public sunsetTime: Date;
  public maxTemperature: number;
  public minTemperature: number;
  public dayTime: WeatherInfo;
  public nightTime: WeatherInfo;
  public nextDayTime: WeatherInfo;
  public date: string;
  public weatherUpdateTs: number;
}
