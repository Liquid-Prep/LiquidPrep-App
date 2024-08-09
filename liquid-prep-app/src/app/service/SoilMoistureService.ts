import { Injectable } from '@angular/core';
import { SoilMoisture } from '../models/SoilMoisture';

@Injectable({
    providedIn: 'root',
})

export class SoilMoistureService {

    private soilMoistureReadingPercentage = 0;
    public sensorIp;

    public setSoilMoistureReading(valuePercentage) {
        this.soilMoistureReadingPercentage = valuePercentage;
    }

    public getSoilMoistureReading() {
        return this.getSoilMoistureByPercentage(this.soilMoistureReadingPercentage);
    }

    public getSoilMoistureByPercentage(percentage: number){
      const soilMoisture = new SoilMoisture();
      soilMoisture.soilMoisturePercentage = percentage;
      if (soilMoisture.soilMoisturePercentage <= 33) {
        soilMoisture.soilMoistureIndex = 'LOW';
      } else if (soilMoisture.soilMoisturePercentage > 33 && soilMoisture.soilMoisturePercentage <= 66) {
        soilMoisture.soilMoistureIndex = 'MEDIUM';
      } else {
        soilMoisture.soilMoistureIndex = 'HIGH';
      }
      return soilMoisture;
    }
}
