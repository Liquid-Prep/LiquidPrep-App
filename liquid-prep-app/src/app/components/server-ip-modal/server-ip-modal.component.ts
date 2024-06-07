import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { WebSocketService } from 'src/app/service/web-socket.service';

@Component({
  selector: 'app-server-ip-modal',
  templateUrl: './server-ip-modal.component.html',
  styleUrls: ['./server-ip-modal.component.scss']
})
export class ServerIpModalComponent implements OnInit {
  ipForm!: FormGroup;

  get espNowGatewayFrmCtrl() {
    return this.ipForm.get('espNowGateway') as FormControl;
  }

  get edgeGatewayFrmCtrl() {
    return this.ipForm.get('edgeGateway') as FormControl;
  }

  get webSocketFrmCtrl() {
    return this.ipForm.get('ws') as FormControl;
  }

  constructor(
    private frmBldr: FormBuilder, 
    private webSocketService: WebSocketService,
    private dialogRef: MatDialogRef<ServerIpModalComponent>
  ) {
    
  }

  ngOnInit(): void {
    let servers = this.webSocketService.getServers();
    let espNowGateway = servers?.espNowGateway || '';
    let edgeGateway = servers?.edgeGateway || '';
    let ws = servers?.ws || '';
    this.ipForm = this.frmBldr.group({
      espNowGateway: [espNowGateway, Validators.required],
      edgeGateway: [edgeGateway, Validators.required],
      ws: [ws, Validators.required]
    });
  }

  updateServer() {
    if (this.ipForm.valid) {
      console.log(this.ipForm.value)
      this.webSocketService.saveServers(this.ipForm.value);
      this.dialogRef.close(this.ipForm.value);
    }
  }
}
