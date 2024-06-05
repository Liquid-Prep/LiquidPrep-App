import { Inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { LOCAL_STORAGE, SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, Subject, timer } from 'rxjs';
import { delayWhen, retryWhen, tap, delay } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const RECONNECT_INTERVAL = 30000;
let WS_ENDPOINT = '';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private $socket: WebSocketSubject<any>;
  private $msgSubject = new Subject();
  $message: any;
  constructor(
    private snackBar: MatSnackBar,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService
  ) {}

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      retryWhen((errors) =>
        errors.pipe(
          tap((val) => console.log('[Data Service] Try to reconnect', val)),
          delayWhen((_) => timer(RECONNECT_INTERVAL))
        )
      )
    );
  }
  private getNewWebSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      //serializer: msg => JSON.stringify({task: "admin,user", msg: {...msg as {}}}),
      closeObserver: {
        next: () => {
          console.log('[DataService]: connection closed');
          this.$socket = undefined;
          this.connect({ reconnect: true });
        },
      },
    });
  }
  saveServers(servers: any) {
    this.localStorage.set('server-info', servers);
  }
  getServers() {
    return this.localStorage.get('server-info');
  }
  saveSensorData(data: any) {
    this.localStorage.set('sensor-data', data);
  }
  getSensorData() {
    return this.localStorage.get('sensor-data');
  }
  showMessage(
    msg: string,
    action: string = 'OK',
    horizontal: MatSnackBarHorizontalPosition = 'center',
    vertical: MatSnackBarVerticalPosition = 'bottom'
  ) {
    let config = new MatSnackBarConfig();
    config.verticalPosition = vertical;
    config.horizontalPosition = horizontal;
    config.duration = 5000;
    this.snackBar.open(msg, action, config);
  }
  connect2(cfg: { reconnect: boolean } = { reconnect: false }): void {
    if (!this.$socket || this.$socket.closed) {
      this.$socket = this.getNewWebSocket();
      this.$message = this.$socket.multiplex(
        () => ({ subscribe: 'LP' }),
        () => ({ unsubscribe: 'LP' }),
        (message) => message.type === 'LP'
      );
    }
  }
  connect(options) {
    this.$socket = webSocket(options);
    return {
      subscribe: (params: any) => {
        const observableA = this.$socket.multiplex(
          () => params,
          () => ({ close: true }),
          (message: any) => {
            console.log(message);
            return message.requestId === params.requestId;
          }
        );
        return observableA;
      },
    };
  }
  wsConnect(ws: string) {
    if (!this.$socket || this.$socket.closed) {
      WS_ENDPOINT = ws;
      this.$socket = webSocket(ws);
      console.log(ws);
      console.log(this.$socket);
      this.$socket
        .pipe(
          retryWhen((errors) =>
            errors.pipe(
              tap((err) => {
                console.error('Got error', err);
                this.wsConnect(ws);
              }),
              delay(1000)
            )
          )
        )
        .subscribe((message) => {
          console.log(message);
          let msg = '';
          Object.keys(message).forEach(
            (key) => {
              msg += `${key}: ${message[key]} | `;
            },
            (error: any) => {
              console.log('error ws');
              console.log(error);
            }
          );
          this.showMessage(msg);
        });
      //this.$message = this.$socket.multiplex(
      //  () => ({subscribe: type}),
      //  () => JSON.stringify({"unsubscribe" : type}),
      //  message => message.type == type
      //)

      //this.$message = this.$socket.multiplex(
      //  () => ({subscribe: 'LP'}),
      //  () => ({unsubscribe: 'LP'}),
      //  message => message.type === 'LP');
    }
  }
  sendMsg(type: string, message: any) {
    this.$message = this.$socket.multiplex(
      () => message,
      () => JSON.stringify({ unsubscribe: type }),
      (message) => message.type == type
    );
    this.$message.subscribe(message);
    //return this.$socket.multiplex(
    //  () => message,
    //  () => JSON.stringify({"unsubscribe" : type}),
    //  message => message.Operation == type
    //)
  }
}
