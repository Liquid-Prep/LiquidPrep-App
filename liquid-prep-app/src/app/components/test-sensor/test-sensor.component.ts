import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SensorService } from '../../service/sensor.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-test-sensor',
  templateUrl: './test-sensor.component.html',
  styleUrls: ['./test-sensor.component.scss']
})

export class TestSensorComponent implements OnInit {

  public selectedVal: 'air' | 'water' | 'soil';
  public countdownSecond = 5;
  public testView: 'before-testing' | 'testing' | 'after-testing' = 'before-testing';
  public testResultColor: 'green' | 'orange' | 'red' = 'green';
  public testResultIcon: 'check_circle' | 'warning' = 'check_circle';
  public testResultIconClass: string;
  private interval;
  public sensorValue = 0;
  public strokeClasses = {
    'custom-spinner-bg-pos' : true,
    'custom-spinner-sk-green' : this.testResultColor === 'green',
    'custom-spinner-sk-orange' : this.testResultColor === 'orange',
    'custom-spinner-sk-red' : this.testResultColor === 'red',
  };

  constructor(private location: Location, private sensorService: SensorService, private http: HttpClient) { }

  ngOnInit(): void {
    this.selectedVal = 'air';
  }

  public onValChange(value: string){
    this.setTestView('before-testing');
    this.sensorValue = 0;
  }

  public backClicked() {
    this.location.back();
  }

  public async onTest(value) {
    if (value === 'ble') {
      this.sensorService.readFromBle().then(resolve => {
        this.sensorValue = resolve > 100 ? resolve / 2 : resolve - 1;
        this.setTestView('testing');
        this.readingCountdown();
      }, reject => {
        window.alert('Failed to connect to sensor via Bluetooth');
        console.log('onTest bluetooth: ', reject);
      });
    } else if (value === 'wifi') {

      this.sensorService.readFromWifi().then(
        resolve => {
          this.sensorValue = resolve > 100 ? resolve / 2 : resolve - 1;
          this.setTestView('testing');
          this.readingCountdown();
        },
        reject => {
          window.alert('Failed to connect to sensor via Wifi');
          console.log('onTest wifi: ', reject);
        }
      );

      /*let sensorMoisturePercentage: number;
      const endpoint = prompt('Please enter sensor endpoint', 'http://xxx.xxx.xxx.xxx/moisture.json');

      try {
        const response: any = await this.http.get(endpoint)
          .pipe()
          .toPromise();
        if (response) {
          sensorMoisturePercentage = response.moisture;
          this.setTestView('testing');
          this.readingCountdown();
        }
        return sensorMoisturePercentage;
      } catch (e) {
        window.alert('Failed to connect to sensor via Bluetooth.  Please try again.');
      }*/
    }
  }

  public readingCountdown(){
    this.interval = setInterval(() => {
      if (this.countdownSecond <= 0){
        this.setTestView('after-testing');
        clearInterval(this.interval);
        this.setMoistureStyleByValue(this.sensorValue);
        // this.soilData = this.soilService.getSoilMoistureReading();
        // if (!this.soilData.soilMoisturePercentage){
        //   this.soilData.soilMoisturePercentage = Math.floor(Math.random() * 100) + 0;
        // }
        // this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(this.soilData.soilMoistureIndex);
        // this.moistureIcon = this.soilMoistureIconMap.get(this.soilData.soilMoistureIndex);
        this.countdownSecond = 5;
      }
      this.countdownSecond--;
    }, 1000);
  }

  public setTestView(status: 'before-testing' | 'testing' | 'after-testing'){
    this.testView = status;
  }

  private setMoistureStyleByValue(sensorValue: number){
    const greenThreshold = 30;
    const orangeThreshold = 80;
    if (sensorValue <= greenThreshold){
      this.testResultColor = 'green';
      this.testResultIcon = 'check_circle';
      this.testResultIconClass = 'moisture-icon-green';
    } else if (sensorValue > greenThreshold && sensorValue < orangeThreshold){
      this.testResultColor = 'orange';
      this.testResultIcon = 'check_circle';
      this.testResultIconClass = 'moisture-icon-orange';
    }else {
      this.testResultColor = 'red';
      this.testResultIcon = 'warning';
      this.testResultIconClass = 'moisture-icon-red';
    }
    this.strokeClasses = {
      'custom-spinner-bg-pos' : true,
      'custom-spinner-sk-green' : this.testResultColor === 'green',
      'custom-spinner-sk-orange' : this.testResultColor === 'orange',
      'custom-spinner-sk-red' : this.testResultColor === 'red',
    };
  }

  public onHeaderClick(data: string){
    if (data === 'leftBtn'){
      this.backClicked();
    }else {
      // TODO
    }
  }
}
