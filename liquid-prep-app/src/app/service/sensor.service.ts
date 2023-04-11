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
  private bluetoothName = 'ESP32-LiquidPrep';
  private serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  private characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

  private wifiEndpoint = undefined;

  private device: any;
  sensorValueSubject = new Subject<number>();

  constructor(private http: HttpClient) { }

  public async readFromBle(): Promise<number>{
    try {
      console.log('readFromBle: ', this.device);
      if (this.device === undefined || (this.device.gatt && this.device.gatt.connected === false)){
        this.device = await (window.navigator as any).bluetooth.requestDevice({
          filters: [{name: this.bluetoothName}],
          optionalServices: [this.serviceUUID] // Required to access service later.
        });
        this.device.addEventListener('gattserverdisconnected', event => {
          const device = event.target;
          console.log(`Device ${device.name} is disconnected.`);
        });
      }
      const server = await this.device.gatt.connect();
      console.log('readFromBle gatt connected: ', this.device.gatt.connected);
      const service = await server.getPrimaryService(this.serviceUUID);
      const characteristics = await service.getCharacteristic(this.characteristicUUID);
      const value = await characteristics.readValue();
      const decoder = new TextDecoder('utf-8');
      const sensorValue = Number(decoder.decode(value));
      this.sensorValueSubject.next(sensorValue);
      return sensorValue;
    }catch (error){
      throw error;
    }
  }

  public async readFromWifi(){
    const  defaultEndPoint = this.wifiEndpoint ? this.wifiEndpoint : 'http://xxx.xxx.xxx.xxx/moisture.json';
    const endpoint = prompt('Please enter sensor endpoint', defaultEndPoint);
    try {
      const response: any = await this.http.get(endpoint).pipe().toPromise();
      if (response) {
        this.wifiEndpoint = endpoint;
        const sensorValue = response.moisture;
        this.sensorValueSubject.next(sensorValue);
        return sensorValue;
      }else {
        console.log('readFromWifi: response is null from ', endpoint);
      }
    } catch (error) {
      throw error;
    }
  }
}
