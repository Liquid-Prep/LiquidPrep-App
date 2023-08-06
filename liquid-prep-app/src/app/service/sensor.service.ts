// <reference types="web-bluetooth" />
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  /**
   * The bluetoothName value is defined in the ESP32 BLE server sketch file.
   * The value should match to exactly to what is defined in the BLE server sketch file.
   * Otherwise the App won't be able to identify the BLE device.
   */
  private readonly bluetoothName = 'ESP32-LiquidPrep';
  private readonly serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  private readonly characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
  private device: any;
  private sensorValueSub: Subject<number>;
  constructor(private http: HttpClient) { }

  private get sensorValueSubject(): Subject<number> {
    if (!this.sensorValueSub) {
      this.sensorValueSub = new Subject<number>();
    }
    return this.sensorValueSub;
  }

  public async connectBluetooth() {
    // Vendor code to filter only for Arduino or similar micro-controllers
    const filter = {
      usbVendorId: 0x2341,
      esp32: 0x1234,
      sample2: 0x12345678,
      device: 0x40080698, // Arduino UNO
      esp32test: 0x400806a8
    };

    let sensorMoisturePercantage: number;
    /**
     * The bluetoothName value is defined in the ESP32 BLE server sketch file.
     * The value should match to exactly to what is defined in the BLE server sketch file.
     * Otherwise the App won't be able to identify the BLE device.
     */
    const bluetoothName = 'ESP32-LiquidPrep';

    /**
     * The serviceUUID and characteristicUUID are the values defined in the ESP32 BLE server sketch file.
     * These values should match to exactly to what is defined in the BLE server sketch file.
     * Otherwise the App won't be able to identify the BLE device.
     */
    const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

    let mobileNavigatorObject: any = window.navigator;

    if (!mobileNavigatorObject.bluetooth) {
      console.error('Web Bluetooth API is not available.');
      return;
    }

    try {
      const device = await mobileNavigatorObject.bluetooth.requestDevice({
        filters: [{
          name: bluetoothName
        }],
        optionalServices: [serviceUUID] // Required to access service later.
      });

      // Set up event listener for when device gets disconnected.
      device.addEventListener('gattserverdisconnected', onDisconnected);

      const server = await device.gatt.connect();

      // Getting Service defined in the BLE server
      const service = await server.getPrimaryService(serviceUUID);

      // Getting Characteristic defined in the BLE server
      const characteristic = await service.getCharacteristic(characteristicUUID);

      const value = await characteristic.readValue();

      const decoder = new TextDecoder('utf-8');
      sensorMoisturePercantage = Number(decoder.decode(value));

      function onDisconnected(event) {
        console.log(`Device ${event.target.name} is disconnected.`);
        console.log('Was it a normal disconnection? ', event.target.gatt.connected);
      }

      return sensorMoisturePercantage;

    } catch (e) {
      window.alert('Failed to connect to sensor via Bluetooth:');
    }
  }
}
