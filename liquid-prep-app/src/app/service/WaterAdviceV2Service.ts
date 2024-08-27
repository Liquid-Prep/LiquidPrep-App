// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Advice } from '../models/Advice';
import {Crop} from '../models/Crop';
import { TodayWeather, WeatherInfo } from '../models/TodayWeather';
import { DateTimeUtil } from '../utility/DateTimeUtil';
import { CropDataService } from './CropDataService';
import { WeatherDataService } from './WeatherDataService';
import { SoilMoistureService } from './SoilMoistureService';
import { SoilMoisture } from '../models/SoilMoisture';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import {PlantGrowthStage} from '../models/api/CropInfoResp';
import { map } from 'rxjs/operators';

export interface AdviceV2 {
    waterRecommended?: number;
    temperature?: number;
    weatherIconTemp?: string;
    rainfallPercentage?: number;
    rainfallIndex?: string;
    wateringDecision?: string;
    soilMoisture?: string;
    soilMoistureIndex?: string;
    imageUrl?: string;
}

@Injectable({
    providedIn: 'root',
})
export class WaterAdviceV2Service {

    public moistureWaterMap = new Map([
      ['None', new Map(
        [
          ['LOW', '/assets/moisture-water/nowater_lowmoisture.png'],
          ['MEDIUM', '/assets/moisture-water/nowater_mediummoisture.png'],
          ['HIGH', '/assets/moisture-water/nowater_highmoisture.png']
        ])],
      ['Little', new Map(
        [
          ['LOW', '/assets/moisture-water/littlewater_lowmoisture.png'],
          ['MEDIUM', '/assets/moisture-water/littlewater_mediummoisture.png'],
          ['HIGH', '/assets/moisture-water/littlewater_highmoisture.png']
        ]
      )],
      ['Modest', new Map(
        [
          ['LOW', '/assets/moisture-water/moderatewater_lowmoisture.png'],
          ['MEDIUM', '/assets/moisture-water/moderatewater_mediummoisture.png'],
          ['HIGH', '/assets/moisture-water/moderatewater_highmoisture.png']
        ]
      )],
      ['Plenty', new Map(
        [
          ['LOW', '/assets/moisture-water/lotswater_lowmoisture.png'],
          ['MEDIUM', '/assets/moisture-water/lotswater_mediummoisture.png'],
          ['HIGH', '/assets/moisture-water/lotswater_highmoisture.png']
        ]
      )]
    ]);

    public ADVICE_TEXT: string[] = ['Plenty', 'Modest', 'Little', 'None'];

    public LOW = 'LOW';
    public MED = 'MEDIUM';
    public HIGH = 'HIGH';
    public OPT = 'OPTIMUM';

    private WATER_CROPS = 'Modest'; // 'Water your crops';
    private DONT_WATER = 'None'; // 'Do not water your crops';
    private WATER_CROPS_LESS = 'Little'; // 'Water your crops less than the recommended value';
    private WATER_CROPS_MORE = 'Plenty'; // 'Water your crops more than the recommended value';
    private DEFAULT_WATER_CROPS = this.WATER_CROPS; // 'Water your crops today ';
    private AND = ' and ';

    constructor(private weatherDataService: WeatherDataService) {}

    public getWaterMoistureIndex(soilMoisture) {
        let soilMoistureValue = parseFloat(soilMoisture);
        if (soilMoistureValue <= 33) {
          return 'LOW';
        } else if (soilMoistureValue > 33 && soilMoistureValue <= 66) {
          return 'MEDIUM';
        } else {
          return 'HIGH';
        }
    }

    public getWaterAdvice(soilMoisture): Observable<AdviceV2> {
        return this.weatherDataService.getTodayWeather().pipe(
            map(todayWeather => {
                return this.createWaterAdvice(todayWeather, soilMoisture);
            })
        )
    }

    private createWaterAdvice(weatherInfo: TodayWeather, soilMoisture: string): AdviceV2 {
      // gather weather info
      // gather crop info for a stage
      const dateTimeUtil = new DateTimeUtil();
      
      let waterAdvice: AdviceV2 = {};

      waterAdvice.soilMoisture = soilMoisture;
      waterAdvice.soilMoistureIndex = this.getWaterMoistureIndex(soilMoisture);

      const isDayTime = dateTimeUtil.isDayTime(weatherInfo.sunriseTime.toString(), weatherInfo.sunsetTime.toString());

      if (isDayTime){
          // The The Weather Company by design returns null values for the dayPart after 3 pm local time.
          // Therefore we should default to nighPart if the dayPart returns null values.
          if (weatherInfo.dayTime.temperature !== null) {
            waterAdvice.temperature = weatherInfo.dayTime.temperature;
            waterAdvice.weatherIconTemp = weatherInfo.dayTime.iconImageUrl;
            waterAdvice = {
                ...waterAdvice,
                ...this.generateWaterAdvice(weatherInfo.dayTime, waterAdvice.soilMoistureIndex)
            }
          } else {
            waterAdvice.temperature = weatherInfo.nightTime.temperature;
            waterAdvice.weatherIconTemp = weatherInfo.nightTime.iconImageUrl;
            waterAdvice = {
                ...waterAdvice,
                ...this.generateWaterAdvice(weatherInfo.nightTime, waterAdvice.soilMoistureIndex)
            }
          }
      } else {
        waterAdvice.temperature = weatherInfo.nightTime.temperature;
        waterAdvice.weatherIconTemp = weatherInfo.nightTime.iconImageUrl;
        waterAdvice = {
            ...waterAdvice,
            ...this.generateWaterAdvice(weatherInfo.nightTime, waterAdvice.soilMoistureIndex)
        }
      }
    //   this.waterAdvice.imageUrl = this.moistureWaterMap.get(this.waterAdvice.wateringDecision)?.get(soilMoisture.soilMoistureIndex);
      return waterAdvice;
    }

    private generateWaterAdvice(weatherInfo: WeatherInfo, soilMoistureIndex: string): AdviceV2{
        let advice: AdviceV2 = {};
        if (this.weatherDataService.isRaining(weatherInfo)) {
            const rainIndex = this.weatherDataService.determineRainIndex(weatherInfo.precipChance);
            advice.rainfallIndex = rainIndex;
            advice.rainfallPercentage = weatherInfo.precipChance;
            advice.wateringDecision = this.determineRainyDayAdvice(rainIndex, soilMoistureIndex);
        } else {
            const temparatureIndex = this.weatherDataService.determineTemperatureIndex(weatherInfo.temperature);
            advice.rainfallIndex = 'NONE';
            advice.rainfallPercentage = weatherInfo.precipChance;
            advice.wateringDecision = this.determineNonRainyDayAdvice(soilMoistureIndex, temparatureIndex);
        }
        return advice;
    }

    private determineRainyDayAdvice(rainIndex: string, soilMoistureIndex: string): string {

        if (rainIndex === this.LOW && soilMoistureIndex === this.LOW) {
            return this.WATER_CROPS;
        } else if (rainIndex === this.LOW && soilMoistureIndex === this.MED) {
            return this.WATER_CROPS_LESS;
        } else if (rainIndex === this.LOW && soilMoistureIndex === this.HIGH) {
            return this.DONT_WATER;
        } else if (rainIndex === this.MED && soilMoistureIndex === this.LOW) {
            return this.WATER_CROPS;
        } else if (rainIndex === this.MED && soilMoistureIndex === this.MED) {
            return this.WATER_CROPS_LESS;
        } else if (rainIndex === this.MED && soilMoistureIndex === this.HIGH) {
            return this.DONT_WATER;
        } else if (rainIndex === this.HIGH && soilMoistureIndex === this.LOW) {
            return this.DONT_WATER;
        } else if (rainIndex === this.HIGH && soilMoistureIndex === this.MED) {
            return this.DONT_WATER;
        } else if (rainIndex === this.HIGH && soilMoistureIndex === this.HIGH) {
            return this.DONT_WATER;
        } else {
            return this.DEFAULT_WATER_CROPS;
        }
    }

    private determineNonRainyDayAdvice(soilMoistureIndex: string, temparatureIndex: string): string {
        if (soilMoistureIndex === this.LOW && temparatureIndex === this.LOW){
            return this.WATER_CROPS;
        } else if (soilMoistureIndex === this.LOW && temparatureIndex === this.OPT) {
            return this.WATER_CROPS;
        } else if (soilMoistureIndex === this.LOW && temparatureIndex === this.MED) {
            return this.WATER_CROPS;
        } else if (soilMoistureIndex === this.LOW && temparatureIndex === this.HIGH) {
            return this.WATER_CROPS_MORE;
        } else if (soilMoistureIndex === this.MED && temparatureIndex === this.LOW) {
            return this.DONT_WATER;
        } else if (soilMoistureIndex === this.MED && temparatureIndex === this.OPT) {
            return this.WATER_CROPS;
        } else if (soilMoistureIndex === this.MED && temparatureIndex === this.MED) {
            return this.WATER_CROPS;
        } else if (soilMoistureIndex === this.MED && temparatureIndex === this.HIGH) {
            return this.WATER_CROPS_MORE;
        } else if (soilMoistureIndex === this.MED && temparatureIndex === this.LOW) {
            return this.DONT_WATER;
        } else if (soilMoistureIndex === this.HIGH && temparatureIndex === this.LOW) {
            return this.DONT_WATER;
        } else if (soilMoistureIndex === this.HIGH && temparatureIndex === this.OPT) {
            return this.DONT_WATER;
        } else if (soilMoistureIndex === this.HIGH && temparatureIndex === this.MED) {
            return this.DONT_WATER;
        } else if (soilMoistureIndex === this.HIGH && temparatureIndex === this.HIGH) {
            return this.WATER_CROPS_LESS;
        } else {
            return this.DEFAULT_WATER_CROPS;
        }
    }
}
