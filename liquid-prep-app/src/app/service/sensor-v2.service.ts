import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from './web-socket.service';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FieldDataService } from './FieldDataService';

@Injectable({
  providedIn: 'root',
})
export class SensorV2Service {
  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService,
    private fieldService: FieldDataService
  ) {}

  fetchSensors() {
    let servers = this.webSocketService.getServers();
    // return of({}).pipe(
    return this.http.get<any>(`${servers.edgeGateway}/log`).pipe(
      // map((response) => {
      //   return {
      //     status: 200,
      //     timeSeries: {
      //       B0A732818BC0: {
      //         name: 'sensor_2-gen-GxfS',
      //         id: 5,
      //         moisture: '0.00',
      //         timestamp: 1717408435799,
      //       },
      //       B0B21CA74064: {
      //         name: 'GATEWAY',
      //         id: 0,
      //         moisture: 11.42,
      //         timestamp: 1717408437896,
      //       },
      //       B0A73281D49C: {
      //         name: 'sensor_1',
      //         id: 5,
      //         moisture: '0.00',
      //         timestamp: 1717408436684,
      //       },
      //     },
      //   };
      // }),
      tap((response) => {
        let oldData = this.webSocketService.getSensorData() || {};
        let timeSeries = Object.assign(oldData, response.timeSeries);
        this.webSocketService.saveSensorData(timeSeries);
      }),
      map((response) => {
        let devices = response.timeSeries;
        let data = [];
        Object.keys(devices).forEach((key) => {
          let sensor = devices[key];
          sensor.mac = key;
          let fullName = sensor.name;
          let fullNameArr = fullName.split('-');
          let name = fullNameArr[0] || '';
          let sensorType = fullNameArr[1] || '';
          let fieldId = fullNameArr[2] || '';
          let field = this.fieldService.getFieldFromMyFieldById(fieldId);

          data.push({
            id: sensor.id,
            name,
            sensorType,
            fieldId,
            field,
            mac: sensor.mac,
            moisture: sensor.moisture,
            lastUpdate: new Date(sensor.timestamp).toLocaleTimeString(
              navigator.language,
              {
                month: '2-digit',
                day: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }
            ),
          });
        });
        return data;
      })
    );
  }
}
