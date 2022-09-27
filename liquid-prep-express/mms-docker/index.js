#! /usr/bin/env node
const https = require('https');
const { createWriteStream, unlinkSync, existsSync, readFileSync } = require('fs');
const jsonfile = require('jsonfile');
const { pipeline } = require('stream');
const zipFile = require('is-zip-file');
const cp = require('child_process'),
exec = cp.exec;

// A simple Horizon sample edge service that shows how to use a Model Management System (MMS) file with your service.
// In this case we use a MMS file as a config file for this service that can be updated dynamically. The service has a default
// copy of the config file built into the docker image. Once the service starts up it periodically checks for a new version of
// the config file using the local MMS API (aka ESS) that the Horizon agent provides to services. If an updated config file is
// found, it is loaded into the service and the config parameters applied (in this case who to say hello to).

// Of course, MMS can also hold and deliver inference models, which can be used by services in a similar way.

let pEnv = process.env;

class Mms {
  // The type and name of the MMS file we are using
  objectType = pEnv.MMS_OBJECT_TYPE;
  objectId;
  updateFilename = pEnv.UPDATE_FILE_NAME;
  // ${HZN_ESS_AUTH} is mounted to this container by the Horizon agent and is a json file with the credentials for authenticating to ESS.
  // ESS (Edge Sync Service) is a proxy to MMS that runs in the Horizon agent.
  essAuth;
  user;
  password;
  auth;
  // ${HZN_ESS_CERT} is mounted to this container by the Horizon agent and the cert clients use to verify the identity of ESS.
  cert =  '--cacert ';
  socket = '--unix-socket ';
  baseUrl = 'https://localhost/api/v1/objects';
  sharedVolume = pEnv.MMS_VOLUME_MOUNT || '/mms-shared';
  tempFile;
  essObjectList;
  essObjectGet;
  essObjectReceived;
  timer;
  timout = 10000;

  constructor() {
    try {
      this.cert += pEnv.HZN_ESS_CERT ? pEnv.HZN_ESS_CERT : '/ess-auth/cert.pem';
      this.socket += pEnv.HZN_ESS_API_ADDRESS ? pEnv.HZN_ESS_API_ADDRESS : '/var/run/horizon/essapi.sock';
      this.essAuth = jsonfile.readFileSync(pEnv.HZN_ESS_AUTH);
      this.user = this.essAuth.id;
      this.password = this.essAuth.token;
      this.auth = `${this.user}:${this.password}`;
      // this.tempFile = `.${this.objectId}`; 
  
      this.essObjectList = `curl -sSL -u ${this.auth} ${this.cert} ${this.socket} ${this.baseUrl}/${this.objectType}`;
      // this.essObjectGet = `curl -sSL -u ${this.auth} ${this.cert} ${this.socket} ${this.baseUrl}/${this.objectType}/${this.objectType}/data -o ${this.sharedVolume}/${this.tempFile}`;
      // this.essObjectReceived = `curl -sSL -X PUT -u ${this.auth} ${this.cert} ${this.socket} ${this.baseUrl}/${this.objectType}/${this.objectId}/received`;
      this.monitor(this.timeout);
    } catch(e) {
      console.log(e)
    }
  }

  monitor(ms) {
    this.timer = setInterval(() => {
      this.process();
    }, ms)
  }

  resetTimer() {
    clearInterval(this.timer);
    this.monitor(this.timout);  
  }

  process() {
    clearInterval(this.timer);
    // See if there is a new version of the config.json file

    try {
      console.log('checking...')
      exec(this.essObjectList, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
        if(!err) {
          console.log(stdout)
          console.log(`done curling`);
          if(stdout && stdout.length > 0) {
            let config = JSON.parse(stdout);
            // console.log(config[this.objectType]);
            if(config.length > 0 && !config[0].deleted) {
              this.objectId = config[0].objectID;
              this.tempFile = `.${this.objectId}`; 
              this.essObjectGet = `curl -sSL -u ${this.auth} ${this.cert} ${this.socket} ${this.baseUrl}/${this.objectType}/${this.objectId}/data -o ${this.sharedVolume}/${this.tempFile}`;
              this.essObjectReceived = `curl -sSL -X PUT -u ${this.auth} ${this.cert} ${this.socket} ${this.baseUrl}/${this.objectType}/${this.objectId}/received`;                
              exec(this.essObjectGet, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
                if(!err) {
                  console.log('ESS object file copy was successful.');
                  exec(this.essObjectReceived, {maxBuffer: 1024 * 2000}, async (err, stdout, stderr) => {
                    if(!err) {
                      console.log('ESS object received command was successful.');
                      if(zipFile.isZipSync(`${this.sharedVolume}/${this.tempFile}`)) {                    
                        console.log('zipped file has arrived...')
                        await this.moveFileToShare(`${this.sharedVolume}/${this.tempFile}`, `${this.sharedVolume}/${this.updateFilename}`);
                      } else {                                                                            
                        console.log('json')
                        let json = JSON.parse(readFileSync(`${this.sharedVolume}/${this.tempFile}`));                                                               
                        console.log(json.hello)
                        if(json.url) {
                          await this.writeFileToShare(json.url, `${this.sharedVolume}/${this.tempFile}`, `${this.sharedVolume}/${this.updateFilename}`);
                        }
                      }   
                    } else {
                      console.log("ERROR ", err);
                    }
                  });      
                } else {
                  console.log("ERROR ", err);
                }
              });
            }
          }
        } else {
          console.log('ERROR ', err);
        }
      });
    } catch(e) {
      console.log(e);
    }
    this.resetTimer();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  writeFileToShare(url, src, dest) {
    return new Promise((resolve, reject) => {
      try {
        let writableStream = createWriteStream(src);                                                           
        const startTime = Date.now();
    
        writableStream.on('close', async () => {
          let cnt = 0;
          const endTime = Date.now();
          console.log(`Time took to download file: ${endTime - startTime}`)
          do {  // wait maximum 3 seconds for file to close
            this.sleep(1000);
          } while(!existsSync(src) && cnt++ < 3);
          if(existsSync(src)) {
            await this.moveFileToShare(src, dest);
          }
          resolve();
        });
        https.get(url, (resp) => {
          pipeline(resp, writableStream, (err) => {
            if(!err) {
            } else {
              console.log(err);
              unlinkSync(tempFile)
            }
          })
        });  
      } catch(e) {
        console.log(e);
        resolve();
      }
    })
  }

  moveFileToShare(src, dest) {
    return new Promise((resolve, reject) => {
      try {
        let arg = `mv ${src} ${dest}`
        console.log(arg);
        const startTime = Date.now();
        exec(arg, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
          if(!err) {
            console.log(`done moving update files to shared volume`);
          } else {
            console.log('failed to move update file to shared volume', err);
          }
          const endTime = Date.now();
          console.log(`Time took to write file: ${endTime - startTime}`)
          resolve();
        });       
      } catch(e) {
        console.log(e)
        resolve();
      }
    });
  }

  fetchUpdateFile(url) {
    let arg = `mv ${this.sharedVolume}/${this.tempFile} ${this.sharedVolume}/${this.updateFilename}`
    console.log(arg);
    exec(arg, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
      if(!err) {
        console.log(`done moving update files to shared volume`);
      } else {
        console.log('failed to move update file to shared volume', err);
      }
    });     
  }
}

new Mms();
