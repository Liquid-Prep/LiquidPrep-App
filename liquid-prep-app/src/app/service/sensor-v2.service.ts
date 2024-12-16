import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from './web-socket.service';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FieldDataService } from './FieldDataService';
import { DecimalPipe } from '@angular/common';
import { SensorStorageService } from './sensor-storage.service';

@Injectable({
  providedIn: 'root',
})
export class SensorV2Service {
  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService,
    private fieldService: FieldDataService,
    private decimalPipe: DecimalPipe,
    private sensorStorageService: SensorStorageService
  ) {}

  sensorTypeMapper = {
    gen: 'Generic Moisture Sensor',
    plm: 'Plantmate Moisture Sensor',
  };

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
      //         name: 'GATEWAY-plm-i6AG',
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
        let sensorMap = this.sensorStorageService.getSensors();
        let unnamedCount = 1;
        Object.keys(devices).forEach((key) => {
          let sensor = devices[key];
          sensor.mac = key;
          let fullName = sensor.name;
          let name = sensorMap[key]?.name;
          if (!name) {
            name = 'Unnamed Sensor';
            unnamedCount++;
          }
          let sensorType = sensorMap[key]?.sensorType || '';
          let fieldId =  sensorMap[key]?.fieldId || '';
          let field = this.fieldService.getFieldFromMyFieldById(fieldId);
          let sensorTypeName = this.sensorTypeMapper[sensorType];
          let moisture = this.calibrateMoisture(sensor.moisture, sensorType, field?.soil);

          data.push({
            id: sensor.id,
            fullName,
            name,
            sensorType,
            sensorTypeName,
            fieldId,
            field,
            mac: sensor.mac,
            moisture,
            moistureRaw: sensor.moisture,
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

  calibrateMoisture(moistureRaw, sensorType, soilType) {
    if (soilType === 'Heavy clay soil') {
      if (sensorType === 'gen') {
        let calibrated = -64.13 + (2.001 * moistureRaw) - (0.01049 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else if (sensorType === 'plm') {
        let calibrated = 7.845 - (0.1526 * moistureRaw) + (0.004196 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else  {
        return '-.--';
      }
    }
    else if (soilType === 'Sandy soil') {
      if (sensorType === 'gen') {
        let calibrated = 2.975 - (0.1909 * moistureRaw) + (0.003405 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else if (sensorType === 'plm') {
        let calibrated = 1.862 - (0.1478 * moistureRaw) + (0.002966 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else  {
        return '-.--';
      }
    }
    else if (soilType === 'Sandy loam soil') {
      if (sensorType === 'gen') {
        let calibrated = 10.39 - (0.5775 * moistureRaw) + (0.007034 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else if (sensorType === 'plm') {
        let calibrated = 3.660 - (0.2944 * moistureRaw) + (0.004669 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else  {
        return '-.--';
      }
    }
    else if (soilType === 'Houston black clay soil') {
      if (sensorType === 'gen') {
        let calibrated = 23.55 - (0.8604 * moistureRaw) + (0.009643 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else if (sensorType === 'plm') {
        let calibrated = 4.404 - (0.0976 * moistureRaw) + (0.003217 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else  {
        return '-.--';
      }
    }
    else if (soilType === 'Austin clay soil') {
      if (sensorType === 'gen') {
        let calibrated = 76.63 - (2.373 * moistureRaw) + (0.01918 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else if (sensorType === 'plm') {
        let calibrated = 19.78 - (0.6717 * moistureRaw) + (0.007462 * (moistureRaw * moistureRaw));
        return this.decimalPipe.transform(calibrated, '1.2-2');
      }
      else  {
        return '-.--';
      }
    }
    else  {
      return '-.--';
    }
  }

  updateSensorName(macAddress, name, sensorType, fieldId) {
    let servers = this.webSocketService.getServers();
    let message = `${servers.espNowGateway}/update?host_addr=${macAddress}&device_name=${name}-${sensorType}-${fieldId}`;
    this.webSocketService.wsConnect(servers.ws);
    this.webSocketService.sendMsg('LP', { from: 'WEB_REQUEST', msg: message });
    console.log(message);
  }

  fetchSensorsByFieldId(fieldId: string) {
    return this.fetchSensors().pipe(
      map(sensors => {
        return sensors.filter(sensor => {
          return sensor.field && sensor.fieldId === fieldId;
        })
      })
    )
  }

  fetchSensorsNotInFieldId(fieldId: string) {
    return this.fetchSensors().pipe(
      map(sensors => {
        return sensors.filter(sensor => {
          return sensor.field && sensor.fieldId !== fieldId;
        })
      })
    )
  }
}
