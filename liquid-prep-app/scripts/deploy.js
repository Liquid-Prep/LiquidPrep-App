#! /usr/bin/env node
const {renameSync, readdirSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, readFile} = require('fs');
const { Observable, forkJoin } = require('rxjs');
const path = require('path')
const cp = require('child_process'),
exec = cp.exec;

const task = process.env.npm_config_task || 'deploy';

let build = {
  deploy: () => {
    return new Observable((observer) => {
      console.log(`begin building liquid-prep-app then deploy bundle...`);
      let arg = `ng build --output-hashing=none --configuration production`;
      let child = exec(arg, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
        if(!err) {
          console.log(`done building liquid-prep-app`);
          const filePath = path.resolve(__dirname, '../../liquid-prep-express')
          arg = `cp -rf dist ${filePath}`
          exec(arg, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
            if(!err) {
              console.log(`done deploying liquid-prep-app`);
              observer.next();
              observer.complete();
            } else {
              console.log('failed to copy dist to backend');
              process.exit(0);
            }
          });
        } else {
          console.log(`failed to build and deploy`, err);
          process.exit(0);
        }
      });
      child.stdout.pipe(process.stdout);
      child.on('data', (data) => {
        console.log(data)
      })
    });
  },
  exit: (msg) => {
    console.log(msg);
    process.exit(0);
  }
}

build[task]()
.subscribe(() => console.log('process completed.'));
