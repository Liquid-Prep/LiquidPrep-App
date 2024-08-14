import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {SoilMoistureService} from '../../service/SoilMoistureService';
import {SoilMoisture} from '../../models/SoilMoisture';
import {LineBreakTransformer} from './LineBreakTransformer';
import {Crop, Measure} from '../../models/Crop';
import {CropDataService} from '../../service/CropDataService';
import {PlantGrowthStage} from '../../models/api/CropInfoResp';
import {HeaderService} from '../../service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import {DateTimeUtil} from "../../utility/DateTimeUtil";

@Component({
  selector: 'app-measure-soil',
  templateUrl: './measure-soil.component.html',
  styleUrls: ['./measure-soil.component.scss'],
})
export class MeasureSoilComponent implements OnInit, AfterViewInit {

  headerConfig: HeaderConfig = {
    headerTitle: 'Measure Soil Moisture',
    leftIconName: 'arrow_back',
    rightIconName: 'volume_up',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: null,
  };

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private soilService: SoilMoistureService,
              private cropService: CropDataService,
              private headerService: HeaderService) { }


  public crop: Crop;
  public stage: PlantGrowthStage;
  public curIndex = 0;
  public isFirstSlide = true;
  public isLastSlide = false;
  public enableUSB = false;
  public countdownSecond = 5;
  public measureView: 'before-measuring' | 'measuring' | 'after-measuring' = 'before-measuring';
  private interval;
  public soilData: SoilMoisture;

  public soilMoistureColorClass = 'color-high';
  public soilMoistureIndexColorMap = new Map([
    ['LOW', 'color-low'],
    ['MEDIUM', 'color-medium'],
    ['HIGH', 'color-high']
  ]);
  public moistureIcon = undefined;
  public soilMoistureIconMap = new Map([
    ['LOW', '/assets/moisture-water/soil_moisture_low.png'],
    ['MEDIUM', '/assets/moisture-water/soil_moisture_medium.png'],
    ['HIGH', '/assets/moisture-water/soil_moisture_high.png']
  ]);

  ngOnInit(): void {
    this.crop = this.cropService.getCrop();
    this.stage = this.cropService.generateCropGrowthStage(this.crop);
    this.headerService.updateHeader(this.headerConfig);
  }

  ngAfterViewInit(): void {
    const swiperEl = document.querySelector('swiper-container');
    swiperEl.addEventListener('swiperslidechange', (event) => {
      this.curIndex = swiperEl.swiper.activeIndex;
      this.isLastSlide=swiperEl.swiper.isEnd;
      this.isFirstSlide=swiperEl.swiper.isBeginning;
    });
  }

  public onSensorConnect(connectionOption){

    if (connectionOption === 'usb') {
      this.connectUSB().then( sensorValue => {
        const soilMoisture = this.sensorValueLimitCorrection(sensorValue);
        this.soilService.setSoilMoistureReading(soilMoisture);
        this.saveMeasuretoCrop(soilMoisture);
        this.setMeasureView('measuring');
        this.readingCountdown();
      });
    } else if (connectionOption === 'ble') {
      this.connectBluetooth().then( sensorValue => {
        const soilMoisture = this.sensorValueLimitCorrection(sensorValue);
        this.soilService.setSoilMoistureReading(soilMoisture);
        this.saveMeasuretoCrop(soilMoisture);
        this.setMeasureView('measuring');
        this.readingCountdown();
      });
    } else {
      alert('Please choose one soil sensor connection option.');
    }
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

    try {
      await (window.navigator as any).bluetooth.requestDevice({
          filters: [{
            name: bluetoothName
          }],
          optionalServices: [serviceUUID] // Required to access service later.
        })
        .then(device => {
          // Set up event listener for when device gets disconnected.
          device.addEventListener('gattserverdisconnected', onDisconnected);

          // Attempts to connect to remote GATT Server.
          return device.gatt.connect();
        })
        .then(server => {
          // Getting Service defined in the BLE server
          return server.getPrimaryService(serviceUUID);
        })
        .then(service => {
          // Getting Characteristic defined in the BLE server
          return service.getCharacteristic(characteristicUUID);
        })
        .then(characteristic => {
          return characteristic.readValue();
        })
        .then(value => {
          const decoder = new TextDecoder('utf-8');
          sensorMoisturePercantage = Number(decoder.decode(value));
        })
        .catch(error => { console.error(error); });

      function onDisconnected(event) {
          const device = event.target;
          console.log(`Device ${device.name} is disconnected.`);
        }

      return sensorMoisturePercantage;

    } catch (e) {
      window.alert('Failed to connect to sensor via Bluetooth');
    }
  }

  public async connectUSB() {
    // Vendor code to filter only for Arduino or similar micro-controllers
    const filter = {
      usbVendorId: 0x2341 // Arduino UNO
    };

    try {
      const port = await (window.navigator as any).serial.requestPort({filters: [filter]});
      // Continue connecting to port 9600.
      await port.open({ baudRate: 9600 });

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const inputStream = textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer()));
      const reader = inputStream.getReader();

      let sensorMoisturePercantage: number;

      // Listen to data coming from the serial device.
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          reader.releaseLock();
          break;
        }

        if (value !== '' || !isNaN(value)) {
          // The value length between 4 and 6 is quite precise
          if (value.length >= 4 && value.length <= 6){
            sensorMoisturePercantage = +value;
            if (!isNaN(sensorMoisturePercantage)) {
              reader.cancel();
              // When reader is cancelled an error will be thrown as designed which can be ignored
              await readableStreamClosed.catch(() => { /* Ignore the error*/  });
              await port.close();

              return sensorMoisturePercantage;
            }
          }
        }

        // Capture sensor data only upto 3 digits
        /*if (value.length >= 3 && value.length <= 5){
          sensorValue = +((+value).toPrecision(3));
          // Sometimes the value will return only 2 digits due to unknown glitch with the length method of the value.
          // Therefore making sure the value is higher than 100.
          if (sensorValue > 100) {
            reader.cancel();
            // When reader is cancelled an error will be thrown as designed which can be ignored
            await readableStreamClosed.catch(() => { });
            await port.close();

            //return sensorValue;
          }
        }*/
      }
    } catch (e) {
      // Permission to access a device was denied implicitly or explicitly by the user.
      window.alert('Failed to connect to sensor via USB') ;
    }
  }

  private sensorValueLimitCorrection(sensorMoisturePercantage: number) {
    if (sensorMoisturePercantage > 100.00) {
      return 100.00;
    } else if (sensorMoisturePercantage < 0.0) {
      return 0.0;
    } else {
      return sensorMoisturePercantage;
    }
  }

  public volumeClicked() {
  }

  public onHeaderClick(data:string){
    if(data == 'leftBtn'){
      this.backClicked();
    }else {
      //TODO
    }
  }

  public backClicked() {
    this.clearCountdown();
    if (this.measureView === 'before-measuring') {
      this.location.back();
    } else {
      this.measureView = 'before-measuring';
    }
  }

  public handleLeftClick(data: string){
    this.backClicked();
  }

  public readingCountdown(){
    // this.countdownSecond = seconds;
    this.interval = setInterval(() => {
      if (this.countdownSecond <= 0){
        this.setMeasureView('after-measuring');
        clearInterval(this.interval);
        this.soilData = this.soilService.getSoilMoistureReading();
        if (!this.soilData.soilMoisturePercentage){
          this.soilData.soilMoisturePercentage = Math.floor(Math.random() * 100) + 0;
        }
        this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(this.soilData.soilMoistureIndex);
        this.moistureIcon = this.soilMoistureIconMap.get(this.soilData.soilMoistureIndex);
        this.countdownSecond = 5;
      }
      this.countdownSecond--;
    }, 1000);
  }

  private clearCountdown(){
    clearInterval(this.interval);
  }

  public setMeasureView(status: 'before-measuring' | 'measuring' | 'after-measuring'){
    console.log('setMeasureView:', status);
    this.measureView = status;
  }

  onGetAdvise() {
    this.router.navigate(['insights/' + this.crop.id ]).then(r => {});
  }

  onMeasure(){
    this.onSensorConnect('ble');
  }

  onSlideNav(direction: string){
    const swiperEl = document.querySelector('swiper-container');
    if (direction === 'next'){
      swiperEl.swiper.slideNext(200);
    }else{
      swiperEl.swiper.slidePrev(200);
    }
  }

  saveMeasuretoCrop(soilMoisture: number){
    if (this.crop.measureRecord === undefined) {
      this.crop.measureRecord = [];
    }
    const measure: Measure = new Measure();
    measure.measureDate = new DateTimeUtil().getTodayDate();
    measure.measureValue = soilMoisture || -1; // if soilMoisture is undefined, assign -1 indicating an invalid measurement.
    this.crop.measureRecord.push(measure);
    this.cropService.storeMyCropsInLocalStorage(this.crop).then(
      (r) => {},
      (e) => { console.error('store crop fail after measuring:', this.crop.cropName, e); }
    );
  }
}
