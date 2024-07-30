import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { WebSocketService } from 'src/app/service/web-socket.service';
import { SensorV2Service } from 'src/app/service/sensor-v2.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { HeaderConfig, HeaderService } from 'src/app/service/header.service';
import { map } from 'rxjs/operators';
import { ServerIpModalComponent } from '../../server-ip-modal/server-ip-modal.component';
import { SensorTypeAndFieldComponent } from '../../sensor-type-and-field/sensor-type-and-field.component';


export class Device {
  status?: any;
  timeSeries: TimeSeries;
  constructor() {
    this.timeSeries = new TimeSeries;
  }
}
export class TimeSeries {
  id?: string;
  name?: string;
  fullName?: string;
  sensorType?: string;
  fieldId?: string;
  mac?: string;
  lastUpdate?: any;
  moisture?: number;
}
export interface IServer {
  edgeGateway: string;
  espNowGateway: string;
  ws: string;
}

@Component({
  selector: 'app-sensors-v2',
  templateUrl: './sensors-v2.component.html',
  styleUrls: ['./sensors-v2.component.scss']
})
export class SensorsV2Component implements OnInit {

  SENSOR_TYPE_MAP = {
    gen: 'Capacitive Soil Moisture Sensor v1.2',
    plm: 'PlantmateⓇ Capacitive Soil Moisture Sensor Module 3.3V',
  }

  headerConfig: HeaderConfig = {
    headerTitle: 'Sensors',
    leftIconName: 'menu',
    leftBtnClick: null,
    rightIconName: 'refresh',
    rightBtnClick: this.refresh.bind(this),
    sortIconName: 'dns',
    sortBtnClick: this.openIpConfigModal.bind(this)
  };


  selectedOption: string = 'lastUpdated';
  selectedLabel: string = 'last updated time';
  noFieldSelectedText: string = 'No field selected';

  devices: TimeSeries[] = [];
  columns: string[] = ['name', 'moisture', 'lastUpdate', 'action'];
  dataSource = new MatTableDataSource<TimeSeries>([]);
  device: Device;
  timeSeries = {};
  actions = [
    // {value: 'device_name', text: 'Device Name'},
    {value: 'air_value', text: 'Calibrate Air'},
    {value: 'water_value', text: 'Calibrate Water'},
    {value: 'esp_interval', text: 'Interval'},
    {value: 'ping', text: 'Ping Sensor'},
    {value: 'query', text: 'Query Sensor'},
    {value: 'moisture', text: 'Get Moisture Reading'},
    {value: 'enable_bluetooth', text: 'Enable Bluetooth'},
    {value: 'disable_bluetooth', text: 'Disable Bluetooth'},
    {value: 'update_pin', text: 'Update Input Pin'},
  ];
  dialogRef: any;
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  espNowGateway = 'http://192.168.1.48';
  edgeGateway = 'http://192.168.1.138:3003';
  ws = 'ws://192.168.1.138:3003';
  servers: IServer;
  showServers = false;
  displayedSensors = [];
  
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private webSocketService: WebSocketService,
    private http: HttpClient,
    private headerService: HeaderService,
    private sensorV2Service: SensorV2Service
  ) { }

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.loadServerIps();
    this.fetchTimeSeries();
  }

  loadServerIps() {
    this.servers = this.webSocketService.getServers();
    this.edgeGateway = this.servers.edgeGateway;
    this.espNowGateway = this.servers.espNowGateway;
    this.ws = this.servers.ws;
  }

  fetchTimeSeries() {
    this.sensorV2Service.fetchSensors()
      .subscribe(
        (data) => {
          this.displayedSensors = data;
          this.dataSource.data = data;
        }
      )
  }
  toggleServers() {
    this.showServers = !this.showServers;
  }
  saveServers() {
    console.log('save')
    this.webSocketService.saveServers({edgeGateway: this.edgeGateway, espNowGateway: this.espNowGateway, ws: this.ws});
  }
  refresh() {
    console.log('refresh')
    this.fetchTimeSeries();
  }
  recommend(mac: string) {
    console.log(mac)
  }
  
  openDialog(payload: any, cb: any) {
    this.dialogRef = this.dialog.open(DialogComponent, {
      hasBackdrop: true,
      width: payload.width || '300px',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: payload
    })
    this.dialogRef.afterClosed().subscribe((result: any) => {
      this.dialog.closeAll();
      cb(result);
    })
  }
  showMessage(msg: string, action: string = 'OK') {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.duration = 3000;
    this.snackBar.open(msg, action, config);
  }
  showDialog(sensor: any) {
    this.openDialog({title: sensor.name, sensor: sensor, ws: this.ws, espnow: this.espNowGateway, type: 'input', placeholder: 'Sensor', buttons: {ok: 'Run'}, object: this.actions, mac: sensor.mac}, (resp: any) => {
      if (resp) {
        console.log(resp);
        this.showMessage('Condition has been saved.');
        this.refresh();
      }
    })
  }  

  showSensorTypeAndFieldDialog(sensor: any) {
    let payload = {
      title: sensor.name, 
      sensor: sensor,
      ws: this.ws, 
      espnow: this.espNowGateway, 
      mac: sensor.mac
    };
    this.dialogRef = this.dialog.open(SensorTypeAndFieldComponent, {
      hasBackdrop: true,
      width: '300px',
      height: 'auto',
      panelClass: 'custom-modalbox',
      data: payload
    })
    this.dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 'SAVED') {
        this.showMessage('Sensor details successfully updated.')
        this.fetchTimeSeries();
      }
    })
  }

  openIpConfigModal() {
    const dialogRef = this.dialog.open(ServerIpModalComponent, {
    });

    dialogRef.afterClosed().subscribe(servers => {
      console.log(servers);
      if (servers) {
        this.edgeGateway = servers.edgeGateway;
        this.espNowGateway = servers.espNowGateway;
        this.ws = servers.ws;
      }
    });
  }
}
