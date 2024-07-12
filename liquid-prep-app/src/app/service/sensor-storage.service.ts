import { Injectable } from '@angular/core';

let SENSOR_STORAGE_KEY = "SENSOR_STORAGE";

@Injectable({
  providedIn: 'root',
})
export class SensorStorageService {

  constructor() {}

  // Save sensor data to localStorage
  saveSensorData(sensors: any[]): void {
    localStorage.setItem('sensors', JSON.stringify(sensors));
  }

  // Retrieve sensor data from localStorage
  getSensorData(): any[] {
    const storedData = localStorage.getItem('sensors');
    return storedData ? JSON.parse(storedData) : [];
  }

  getSensors(): any {
    let storedSensors = localStorage.getItem(SENSOR_STORAGE_KEY);
    return storedSensors ? JSON.parse(storedSensors) : {};
  }

  saveSensors(sensorMap) {
    localStorage.setItem(SENSOR_STORAGE_KEY, JSON.stringify(sensorMap));
  }

  updateSensorByMacAddress(macAddress, sensorType, fieldId) {
    let sensors = this.getSensors();
    sensors[macAddress]= {
      sensorType,
      fieldId
    };
    this.saveSensors(sensors);
  }
}
