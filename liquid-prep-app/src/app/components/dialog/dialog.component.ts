import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { WebSocketService } from '../../service/web-socket.service';

export interface DialogData {
  title: string;
  type: string;
  name: string;
  espnow: string;
  ws: string;
  placeholder: string;
  mac: string;
  object: any;
  buttons: any;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  //@ViewChild('display', { static: false, read: ElementRef})
  cancelLabel = 'Cancel';
  okLabel = 'Save';
  notOK = true;
  label = '';
  newValue = '';
  show = false;
  msg = '';
  html = '';
  selected = '';
  
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private webSocketService: WebSocketService,
    private http: HttpClient   
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.buttons) {
      this.okLabel = this.data.buttons.ok ? this.data.buttons.ok : this.okLabel
      this.cancelLabel = this.data.buttons.cancel ? this.data.buttons.cancel : this.cancelLabel
    }
  }
  onSelectChange(evt: any) {
    if(evt.isUserInput) {
      console.log(evt.source.value)
      this.selected = evt.source.value;
      switch(this.selected) {
        case 'device_name':
          this.label = 'Name'
          this.newValue = this.data.title;
          this.show = true;
          break;
        case 'air_value':
          this.label = 'Air Value'
          this.show = false;
          break;
        case 'query':
          this.label = 'Query';
          this.show = false;
          break;  
        case 'ping':
          this.label = 'Ping';
          this.show = false;
          break;  
        case 'water_value':
          this.label = 'Water Value'
          this.show = false;
          break;
        case 'enable_bluetooth':
          this.show = false;
          break;
        case 'disable_bluetooth':
          this.show = false;
          break;
        case 'esp_interval':
          this.label = 'Interval'
          this.newValue = "";
          this.show = true;
          break;
        case 'update_pin':
          this.label = 'Update Pin'
          this.newValue = "";
          this.show = true;
          break;
        }
    }
  }
  onChange(evt: any) {
    if(evt.isUserInput) {
      console.log(evt.source.value)
      let type = evt.source.value;
      //this.data.type = type.match(/query/) ? 'display' : 'input'
      switch(type) {
        case 'device_name':
          this.label = 'Name'
          this.newValue = this.data.title;
          this.show = true;
          this.msg = `${this.data.espnow}/${type}?host_addr=${this.data.mac}&device_name=${this.newValue}&web_request=true`;
          break;
        case 'air_value':
          this.label = 'Air Value'
          this.show = false;
          this.msg = `${this.data.espnow}/${type}?host_addr=${this.data.mac}&web_request=true`;
          break;
        case 'query':
          this.label = 'Query';
          this.show = false;
          this.msg = `${this.data.espnow}/${type}?host_addr=${this.data.mac}&web_request=true`;
          break;  
        case 'ping':
          this.label = 'Ping';
          this.show = false;
          this.msg = `${this.data.espnow}/${type}?host_addr=${this.data.mac}&web_request=true`;
          break;  
        case 'moisture':
          this.label = 'Get Moiture';
          this.show = false;
          this.msg = `${this.data.espnow}/${type}?host_addr=${this.data.mac}&web_request=true`;
          break;  
        case 'water_value':
          this.label = 'Water Value'
          this.show = false;
          break;
        case 'esp_interval':
          this.label = 'Interval'
          this.newValue = "";
          this.show = true;
          this.msg = `${this.data.espnow}/${type}?host_addr=${this.data.mac}&interval=${this.newValue}&web_request=true`;
          break;
        case 'enable_bluetooth':
          this.label = 'Enable Bluetooth'
          this.show = false;
          break;
        case 'disable_bluetooth':
          this.label = 'Disable Bluetooth'
          this.show = false;
          break;
        case 'update_pin':
          this.label = 'Update Pin'
          this.newValue = "";
          this.show = true;
          break;
        }
    }
  }
  cancel(): void {
    this.dialogRef.close();
  }
  run() {
    let type = this.selected;
    console.log(type);
    switch(type) {
      case 'air_value':
      case 'water_value':
          this.msg = `${this.data.espnow}/calibrate?value=${type}&host_addr=${this.data.mac}`;
        break;
      case 'moisture':
      case 'query':
      case 'ping':
          this.msg = `${this.data.espnow}/${type}?host_addr=${this.data.mac}&web_request=true`;
        break;  
      case 'device_name':
      case 'esp_interval':
        this.msg = `${this.data.espnow}/update?host_addr=${this.data.mac}&${type}=${this.newValue}`;
        break;
      case 'enable_bluetooth':
      case 'disable_bluetooth':
        this.msg = `${this.data.espnow}/update?host_addr=${this.data.mac}&${type}=`;
        break;
      case 'update_pin':
        this.msg = `${this.data.espnow}/update?host_addr=${this.data.mac}&${type}=${this.newValue}`;
        break;
      }
    this.webSocketService.wsConnect(this.data.ws);
    this.webSocketService.sendMsg('LP', {from: 'WEB_REQUEST', msg: this.msg});
  }  
}
