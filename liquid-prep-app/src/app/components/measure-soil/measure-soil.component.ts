import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperComponent } from 'ngx-swiper-wrapper';
import { SwiperOptions } from 'swiper';

import { SoilMoisture } from '../../models/SoilMoisture';
import { SoilMoistureService } from '../../service/SoilMoistureService';
import { LineBreakTransformer } from './LineBreakTransformer';

@Component({
  selector: 'app-measure-soil',
  templateUrl: './measure-soil.component.html',
  styleUrls: ['./measure-soil.component.scss'],
})
export class MeasureSoilComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private soilService: SoilMoistureService
  ) {}

  public config: SwiperOptions = {
    a11y: { enabled: true },
    direction: 'horizontal',
    slidesPerView: 1,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: false,
      hideOnClick: false,
    },
    longSwipesRatio: 0.1,
    longSwipesMs: 100,
    threshold: 5,
  };

  @ViewChild(SwiperComponent, { static: false }) swiper?: SwiperComponent;

  public curIndex = 0;
  public isFirstSlide = true;
  public isLastSlide = false;
  public disabled = false;
  public countdownSecond = 5;
  public measureView: 'before-measuring' | 'measuring' | 'after-measuring' =
    'before-measuring';
  private interval;
  public soilData: SoilMoisture;

  public soilMoistureColorClass = 'color-high';
  public soilMoistureIndexColorMap = new Map([
    ['LOW', 'color-low'],
    ['MEDIUM', 'color-medium'],
    ['HIGH', 'color-high'],
  ]);
  public moistureIcon = undefined;
  public soilMoistureIconMap = new Map([
    ['LOW', 'assets/moisture-water/soil_moisture_low.png'],
    ['MEDIUM', 'assets/moisture-water/soil_moisture_medium.png'],
    ['HIGH', 'assets/moisture-water/soil_moisture_high.png'],
  ]);

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  public onSensorConnect(connectionOption) {
    let data = {};
    if (connectionOption === 'usb') {
      this.connectUSB().then((sensorValue) => {
        this.showReading(sensorValue);
      });
    } else if (connectionOption === 'ble') {
      this.connectBluetooth().then((sensorValue) => {
        this.showReading(sensorValue);
      });
    } else if (connectionOption === 'wifi') {
      this.updateWifi().then((channel) => {
        if (!isNaN(parseInt(channel))) {
          data = { type: 'CHANNEL', value: channel };
          console.log(data);
          this.heyBluetooth(data);
          //this.connectBluetooth().then( sensorValue => {
          //  this.updateChannel(channel);
          //});
        } else {
          console.log('invalid channel');
        }
      });
    } else if (connectionOption === 'calibrate') {
      this.calibrate().then((mode) => {
        if (mode.toLowerCase() == 'air' || mode.toLowerCase() == 'water') {
          data = { type: 'CALIBRATE', value: mode };
          console.log(data);
          this.heyBluetooth(data);
        } else {
          console.log('invalid channel');
        }
      });
    } else if (connectionOption === 'ble_name') {
      this.updateBLE().then((name) => {
        data = { type: 'NAME', value: name };
        console.log(data);
        this.heyBluetooth(data);
      });
    } else if (connectionOption === 'ble_off') {
      data = { type: 'BLEOFF', value: '' };
      console.log(data);
      this.heyBluetooth(data);
    } else if (connectionOption === 'input_pin') {
      this.inputPin().then((pin) => {
        if (!isNaN(parseInt(pin))) {
          data = { type: 'PIN', value: pin };
          console.log(data);
          this.heyBluetooth(data);
        } else {
          console.log('invalid pin');
        }
      });
    } else {
      alert('Please choose one soil sensor connection option.');
    }
  }

  async heyBluetooth(data: any) {
    const serviceUUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
    const characteristicUUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

    try {
      let jsonStr = JSON.stringify(data);
      console.log(jsonStr);
      let payload = this.str2ab(jsonStr);
      await (window.navigator as any).bluetooth
        .requestDevice({
          filters: [
            {
              services: [serviceUUID],
              //namePrefix: "ESP32"
            },
          ],
          optionalServices: [serviceUUID], // Required to access service later.
        })
        .then((device) => {
          // Attempts to connect to remote GATT Server.
          return device.gatt.connect();
        })
        .then((server) => {
          // Getting Service defined in the BLE server
          return server.getPrimaryService(serviceUUID);
        })
        .then((service) => {
          // Getting Characteristic defined in the BLE server
          return service.getCharacteristic(characteristicUUID);
        })
        .then((characteristic) => {
          return characteristic.writeValue(payload);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (e) {
      console.log(e);
    }
  }
  str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
  showReading(sensorValue: number) {
    if (sensorValue) {
      const soilMoisture = this.sensorValueLimitCorrection(sensorValue);
      this.soilService.setSoilMoistureReading(soilMoisture);
      this.setMeasureView('measuring');
      this.readingCountdown();
    }
  }
  async calibrate() {
    const mode = prompt('Please enter <Water> or <Air> for calibration');
    return mode;
  }
  async inputPin() {
    let valid = false;
    let pin;

    while (!valid) {
      pin = prompt('Please enter PIN between 0 and 39', '');
      pin = parseInt(pin);

      if (!isNaN(pin) && pin >= 0 && pin <= 39) {
        valid = true;
      } else {
        alert('Invalid PIN. Please enter a number between 0 and 39.');
      }
    }

    return pin;
  }
  async updateWifi() {
    const channel = prompt('Please enter WiFi Channel');
    return channel;
  }
  async updateBLE() {
    const channel = prompt('Please enter new Device Name');
    return channel;
  }
  async connectWifi() {
    let sensorMoisturePercantage: number;
    const ip =
      this.soilService.sensorIp && this.soilService.sensorIp.length > 0
        ? this.soilService.sensorIp
        : 'http://xxx.xxx.xxx.xxx/moisture.json';
    const endpoint = prompt('Please enter sensor endpoint', ip);
    if (endpoint) {
      this.soilService.sensorIp = endpoint;
    }

    try {
      let response: any = await this.http.get(endpoint).pipe().toPromise();
      if (response) {
        sensorMoisturePercantage = response.moisture;
      }
      return sensorMoisturePercantage;
    } catch (e) {
      window.alert('Failed to connect to sensor via WiFi.  Please try again.');
    }
  }
  public async connectBluetooth() {
    // Vendor code to filter only for Arduino or similar micro-controllers
    const filter = {
      usbVendorId: 0x2341,
      esp32: 0x1234,
      sample2: 0x12345678,
      device: 0x40080698, // Arduino UNO
      esp32test: 0x400806a8,
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
      await (window.navigator as any).bluetooth
        .requestDevice({
          filters: [
            {
              namePrefix: 'ESP32',
            },
          ],
          optionalServices: [serviceUUID], // Required to access service later.
        })
        .then((device) => {
          // Set up event listener for when device gets disconnected.
          device.addEventListener('gattserverdisconnected', onDisconnected);

          // Attempts to connect to remote GATT Server.
          return device.gatt.connect();
        })
        .then((server) => {
          // Getting Service defined in the BLE server
          return server.getPrimaryService(serviceUUID);
        })
        .then((service) => {
          // Getting Characteristic defined in the BLE server
          return service.getCharacteristic(characteristicUUID);
        })
        .then((characteristic) => {
          return characteristic.readValue();
        })
        .then((value) => {
          const decoder = new TextDecoder('utf-8');
          sensorMoisturePercantage = Number(decoder.decode(value));
        })
        .catch((error) => {
          console.error(error);
        });

      function onDisconnected(event) {
        const device = event.target;
        console.log(`Device ${device.name} is disconnected.`);
      }

      return sensorMoisturePercantage;
    } catch (e) {
      window.alert(
        'Failed to connect to sensor via Bluetooth.  Please try again.'
      );
    }
  }

  public async connectUSB() {
    // Vendor code to filter only for Arduino or similar micro-controllers
    const filter = {
      usbVendorId: 0x2341, // Arduino UNO
    };

    try {
      const port = await (window.navigator as any).serial.requestPort({
        filters: [filter],
      });
      // Continue connecting to port 9600.
      await port.open({ baudRate: 9600 });

      const textDecoder = new TextDecoderStream();
      const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      const inputStream = textDecoder.readable.pipeThrough(
        new TransformStream(new LineBreakTransformer())
      );
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
          if (value.length >= 4 && value.length <= 6) {
            sensorMoisturePercantage = +value;
            if (!isNaN(sensorMoisturePercantage)) {
              reader.cancel();
              // When reader is cancelled an error will be thrown as designed which can be ignored
              await readableStreamClosed.catch(() => {
                /* Ignore the error*/
              });
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
      window.alert('Failed to connect to sensor via USB.  Please try again.');
    }
  }

  private sensorValueLimitCorrection(sensorMoisturePercantage: number) {
    if (sensorMoisturePercantage > 100.0) {
      return 100.0;
    } else if (sensorMoisturePercantage < 0.0) {
      return 0.0;
    } else {
      return sensorMoisturePercantage;
    }
  }

  public onIndexChange(index: number): void {
    this.curIndex = index;
    if (index === 0) {
      this.isFirstSlide = true;
      this.isLastSlide = false;
    } else if (index === 2) {
      this.isFirstSlide = false;
      this.isLastSlide = true;
    } else {
      this.isFirstSlide = false;
      this.isLastSlide = false;
    }
  }

  public onSwiperEvent(event: string): void {}

  public volumeClicked() {}

  public backClicked() {
    this.clearCountdown();
    if (this.measureView === 'before-measuring') {
      this.location.back();
    } else {
      this.measureView = 'before-measuring';
    }
  }

  public readingCountdown() {
    // this.countdownSecond = seconds;
    this.interval = setInterval(() => {
      if (this.countdownSecond <= 0) {
        this.setMeasureView('after-measuring');
        clearInterval(this.interval);
        this.soilData = this.soilService.getSoilMoistureReading();
        this.soilMoistureColorClass = this.soilMoistureIndexColorMap.get(
          this.soilData.soilMoistureIndex
        );
        this.moistureIcon = this.soilMoistureIconMap.get(
          this.soilData.soilMoistureIndex
        );
      }
      this.countdownSecond--;
    }, 1000);
  }

  private clearCountdown() {
    clearInterval(this.interval);
  }

  public setMeasureView(
    status: 'before-measuring' | 'measuring' | 'after-measuring'
  ) {
    this.measureView = status;
  }

  onGetAdvise() {
    this.router.navigate(['advice']).then((r) => {});
  }

  onSlideNav(direction: string) {
    if (direction === 'next') {
      this.swiper.directiveRef.nextSlide(200);
    } else {
      this.swiper.directiveRef.prevSlide(200);
    }
  }
}
