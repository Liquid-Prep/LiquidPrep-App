import { IBroker } from 'liquid-prep-lib';
import { Subject } from 'rxjs';

import { Server } from './server';

export const $broker = new Subject().asObservable().subscribe((data: IBroker) => {
  if(data.name == 'score') {
    console.log('subscribe: ', data)
    if(data.assetType === 'Image') {
    } else {
    } 
  }
});

let port = 3000;
process.argv.some((argv) => {
  const match = argv.match(/--port=/)
  if(match) {
    port = parseInt(argv.replace(match[0], ''));
  }
})

export class Index {
  server = new Server(port);
  constructor() {

  }
}

new Index()