import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SensorService } from '../../service/sensor.service';
import { HeaderService } from 'src/app/service/header.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-test-sensor',
  templateUrl: './test-sensor.component.html',
  styleUrls: ['./test-sensor.component.scss']
})

export class TestSensorComponent implements OnInit {

  public testType: 'air' | 'water' | 'soil';
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

  constructor(private location: Location, private sensorService: SensorService, private http: HttpClient, private headerService: HeaderService) { }

  ngOnInit(): void {
    this.testType = 'air';

    this.headerService.updateHeader(
      'Test Sensor',                  // headerTitle
      'arrow_back',                     // leftIconName
      'volume_up',                         // rightIconName
      this.handleLeftClick.bind(this),  // leftBtnClick
      null,                             // rightBtnClick
    );
  }

  public handleLeftClick(data: string){
    this.backClicked();
  }

  public onValChange(value: 'air' | 'water' | 'soil'){
    this.setTestView('before-testing');
    this.testType = value;
    this.sensorValue = 0;
  }

  public backClicked() {
    this.location.back();
  }

  public async onTest(value) {
    if (value === 'ble') {
      try {
        const sensorValue = await this.sensorService.connectBluetooth();
        this.sensorValue = sensorValue;
        this.setTestView('testing');
        this.readingCountdown();
      }catch (error){
        window.alert('Failed to connect to sensor via Bluetooth');
        console.log('onTest bluetooth: ', error);
      }
    }
  }

  public readingCountdown(){
    this.interval = setInterval(() => {
      if (this.countdownSecond <= 0){
        clearInterval(this.interval);
        this.setTestView('after-testing');
        this.setMoistureStyleByValue(this.sensorValue);
        // this.soilData = this.soilService.getSoilMoistureReading();
        // if (!this.soilData.soilMoisturePercentage){
        //   this.soilData.soilMoisturePercentage = Math.floor(Math.random() * 100) + 0;
        // }
        // this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(this.soilData.soilMoistureIndex);
        // this.moistureIcon = this.soilMoistureIconMap.get(this.soilData.soilMoistureIndex);
        this.countdownSecond = 5;
      }else {
        this.countdownSecond--;
      }
    }, 1000);
  }

  public setTestView(status: 'before-testing' | 'testing' | 'after-testing'){
    this.testView = status;
  }

  private setMoistureStyleByValue(sensorValue: number){
    let  color4res: 'green' | 'orange' | 'red' = 'green';
    if (sensorValue < 0 || sensorValue > 100){
      color4res = 'red';
    } else{
      if (this.testType === 'soil') {
        color4res = 'green';
      }else if (this.testType === 'air'){
        if (sensorValue < 6){
          color4res = 'green';
        }else{
          color4res = 'red';
        }
      }else if (this.testType === 'water'){
        if (sensorValue > 95){
          color4res = 'green';
        }else {
          color4res = 'red';
        }
      }
    }

    switch (color4res) {
      case 'green':
        this.testResultColor = 'green';
        this.testResultIcon = 'check_circle';
        this.testResultIconClass = 'moisture-icon-green';
        break;
      case 'red':
        this.testResultColor = 'red';
        this.testResultIcon = 'warning';
        this.testResultIconClass = 'moisture-icon-red';
        break;
    }
    this.strokeClasses = {
      'custom-spinner-bg-pos' : true,
      'custom-spinner-sk-green' : this.testResultColor === 'green',
      'custom-spinner-sk-orange' : false,
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
