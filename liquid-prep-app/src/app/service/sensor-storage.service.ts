import { Injectable } from '@angular/core';

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
}
