import { Server } from './server'
import { Observable, Subject, forkJoin } from 'rxjs';
import { IBroker } from 'liquid-prep-lib'

export const $broker = new Subject().asObservable().subscribe((data: IBroker) => {
  if(data.name == 'score') {
    console.log('subscribe: ', data)
    if(data.assetType === 'Image') {
    } else {
    } 
  }
});

export class Index {
  server = new Server();
  constructor() {

  }
}

new Index()