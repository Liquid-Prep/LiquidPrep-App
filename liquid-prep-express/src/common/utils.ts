import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, unlinkSync } from 'fs';
import * as http from 'http';
import { forkJoin, Observable, Subject } from 'rxjs';
import WebSocket from 'ws';

//const ffmpeg = require('ffmpeg');
//const tfnode = require('@tensorflow/tfjs-node');
const tfnode :any = {};
const jsonfile = require('jsonfile');
const cp = require('child_process'),
exec = cp.exec;

export class EnumClass {
  private enum: any = {};
  constructor(private eArray: any[] = []) {
    eArray.map((el, idx) => {
      this.enum[el] = idx;
    });
  }

  getEnum(key: string) {
    return this.enum[key];
  }
}

export enum Task {
  NO_TASK = 0,
  UPDATE_RECEIVER_ADDR = 1,
  UPDATE_WIFI_CHANNEL = 2,
  UPDATE_DEVICE_NAME = 3,
  UPDATE_DEVICE_ID = 4,
  UPDATE_ESP_INTERVAL = 5,
  GET_MOISTURE = 6,
  MOISTURE_RESULT = 7,
  RELATE_MESSAGE = 8,
  RELATE_MESSAGE_UPSTREAM = 9,
  CONNECT_WITH_ME = 10,
  MESSAGE_ONLY = 11,
  PING = 12,
  PING_BACK = 13,
  QUERY = 14,
  QUERY_RESULT = 15,
  CONNECT_WITH_YOU = 16,
  CALIBRATE_AIR = 17,
  CALIBRATE_WATER = 18,
  CALIBRATE_RESULT = 19,
  BROADCAST = 20,
  WEB_REQUEST = 21,
  WEB_REQUEST_RESULT = 22,
  UPDATE_WIFI_RESULT = 23,
  ENABLE_BLUETOOTH = 24,
  DISABLE_BLUETOOTH = 25,
  UPDATE_PIN = 26
};
export class Utils {
  homePath = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
  mmsPath = '/mms-shared';
  localPath = './local-shared';
  assets = './assets';
  public = './public';
  imagePath = './public/images';
  videoPath = './public/video';
  currentModelPath = './model';
  newModelPath = './model-new';
  oldModelPath = './model-old';
  stockModelPath = './ml-models';
  staticPath = './public/js';
  backupPath = './public/backup';
  oldImage = `./public/images/image-old.png`;
  sharedPath = '';
  intervalMS = 10000;
  timer: NodeJS.Timer = null;
  videoFormat = ['.mp4', '.avi', '.webm'];
  videoSrc = '/static/backup/video-old.mp4';
  confidentCutoff = 0.5;
  assetType = 'Image';
  model;
  labels;
  version;
  state = {
    server: null,
    sockets: [],
  };
  timeSeries = {};
  $score = new Subject().asObservable().subscribe((data:any) => {
    if(data.name == 'score') {
      this.confidentCutoff = parseFloat(data.score);
      console.log('subscribe: ', data)
      this.assetType = data.assetType; 
      if(data.assetType === 'Image') {
        this.renameFile(this.oldImage, `${this.imagePath}/image.png`);  
      } else {
        let images = this.getFiles(this.videoPath, /.jpg|.png/);
        console.log(images)
        this.inferenceVideo(images);  
      } 
    }
  });
  $model = new Subject().asObservable().subscribe((data:any) => {
    if(data.name == 'model') {
      let model = data.model.toLowerCase();
      console.log('subscribe: ', data)
      this.assetType = data.assetType;
      let arg = `cp ${this.stockModelPath}/${model}/model.zip ${this.sharedPath} && cp ${this.stockModelPath}/${model}/image.png ${this.imagePath} `;
      this.shell(arg)
      .subscribe(() => {
        if(data.assetType === 'Image') {
          this.checkImage();
          //this.renameFile(this.oldImage, `${this.imagePath}/image.png`);  
        } else {
          let images = this.getFiles(this.videoPath, /.jpg|.png/);
          console.log(images)
          this.inferenceVideo(images);  
        }   
      })
    }
  });

  constructor(private server: any, private port: number) {
    this.init()
  }
  init() {
    this.initWebSocketServer();
    if(!existsSync(this.localPath)) {
      mkdirSync(this.localPath);
    }
    if(!existsSync(this.assets)) {
      mkdirSync(this.assets);
    }
    if(!existsSync(this.public)) {
      mkdirSync(this.public);
    }
    if(!existsSync(this.imagePath)) {
      mkdirSync(this.imagePath);
    }
    if(!existsSync(this.videoPath)) {
      mkdirSync(this.videoPath);
    }
    if(!existsSync(this.currentModelPath)) {
      mkdirSync(this.currentModelPath);
    }
    if(!existsSync(this.newModelPath)) {
      mkdirSync(this.newModelPath);
    }
    if(!existsSync(this.oldModelPath)) {
      mkdirSync(this.oldModelPath);
    }
    if(!existsSync(this.oldModelPath)) {
      mkdirSync(this.oldModelPath);
    }
    //this.loadModel(this.currentModelPath)
    //this.initialInference();  
    //this.setInterval(this.intervalMS);
  }
  setTimeInterval(ms: number) {
    this.intervalMS = ms;
  }
  getResult(input: any, title: String) {
    let msg = input.msg.split(',');
    let res = {
      name: input.name,
      id: input.id,
      interval: input.interval,
      airValue: msg[0],
      waterValue: msg[1],
      pin: msg[2],
      channel: msg[3],
      senderMac: msg[4],
      receiverMac: msg[5],
      moisture: msg[6],
      bluetooth: msg[7] == 1 ? 'On' : 'Off'
    }
    console.log(`${title}: %j\n` , res)
    return res;
  }
  initWebSocketServer() {
    // Creating a new websocket server
    const wss = new WebSocket.Server({server: this.server})
    
    // Creating connection using websocket
    wss.on("connection", ws => {
      console.log("new client connected", ws._socket.remoteAddress);
      // sending message
      ws.on("message", data => {
        console.log(`Client has sent us: ${data}\n`)
        try {
          let input = JSON.parse(data);
          console.log(input.from)
          if(input.from == 'WEB_REQUEST') {
            console.log('web request', Task.WEB_REQUEST)
            let data = '';
            http.get(input.msg, (resp) => {
              resp.on('data', (chunk) => {
                data += chunk;
              });
              resp.on('end', () => {
                console.log(data)
              });       
            })
          } else {
            let jsonStr = ''; 
            if(input.task == Task.PING_BACK) {
              jsonStr = JSON.stringify({ping: `Received from ${input.name}`});
              console.log(`${jsonStr}\n`)
            } else if(input.task == Task.QUERY_RESULT) {
              jsonStr = JSON.stringify(this.getResult(input, 'Query result'))
              //this.getResult(input, 'Query result');
            } else if(input.task == Task.CALIBRATE_RESULT) {
              jsonStr = JSON.stringify(this.getResult(input, 'Calibrate result'))
              //this.getResult(input, 'Calibrate result');
            } else if(input.task == Task.MOISTURE_RESULT) {
              let json = this.getResult(input, 'Moisture result');
              if(input.mac && input.mac.length == 12) {
                this.timeSeries[input.mac] = {name: input.name, id: input.id, moisture: json.moisture, timestamp: Date.now()}
              }
              jsonStr = JSON.stringify(json)
            } else {
              if(input.mac && input.mac.length == 12) {
                this.timeSeries[input.mac] = {name: input.name, id: input.id, moisture: input.moisture, timestamp: Date.now()}
              }
              jsonStr = JSON.stringify({})
              console.log('Currentlog: %j\n' , this.timeSeries)
            }    
            if(input.from == Task.WEB_REQUEST_RESULT) {
              console.log('web request', input.from)
              wss.clients.forEach((client) => {
                if(client != ws && client.readyState) {
                  console.log(jsonStr)
                  client.send(jsonStr)
                }
              })  
            }
          }
        } catch(e) {
          console.log('JSON parse error...', data)          
        }
      });
      // handling what to do when clients disconnects from server
      ws.on("close", () => {
        console.log("the client has disconnected");
      });
      // handling client connection error
      ws.onerror = function () {
        console.log("Some Error occurred")
      }
    });
    require('dns').lookup(require('os').hostname(), (err, add, fam) => {
      console.log(`The WebSocket server is running on ${add}:${this.port}`);
    })
    this.state.server = this.server.listen(this.port, () => {
      console.log(`Started on ${this.port}`);
    });
    this.state.server.on('connection', (socket) => {
      //this.state.sockets.forEach((socket, index) => {
      //  if (socket.destroyed === false) {
      //    socket.destroy();
      //  }
      //});
      //this.state.sockets = []
      //this.state.sockets.push(socket);
      //console.log('Socket added: ', this.state.sockets.length)
    })
  }
  resetTimer() {
    clearInterval(this.timer);
    this.timer = null;
    this.setInterval(this.intervalMS);  
  }
  getVideoFile(file) {
    let video = undefined;
    this.videoFormat.every((ext) => {
      let v = `${file}${ext}`;
      if(existsSync(v)) {
        video = v;
        return false;
      } else {
        return true;
      }
    })
    return video;
  }
  async checkImage () {
    try {
      let imageFile = `${this.imagePath}/image.png`;
      if(!existsSync(imageFile)) {
        imageFile = `${this.imagePath}/image.jpg`;
      }
      if(existsSync(imageFile)) {
        try {
          let cycles = 0;
          console.log(imageFile)
          //sharp(imageFile)
          //  .resize(512,512)
          //  .toBuffer()
          //  .then((data) => {
          //    const image = data;
          //    let decodedImage = tfnode.node.decodeImage(image, 3);
          //    console.log('tensor shape', decodedImage.shape)
          //    let inputTensor;
          //    switch(this.version.type) {
          //      case 'float':                  
          //        inputTensor = decodedImage.expandDims(0).cast('float32');
          //        break;
          //      default:
          //        inputTensor = decodedImage.expandDims(0);
          //        break;
          //    }
          //    this.inference(inputTensor)
          //    .subscribe({
          //        next: (json) => {
          //        let images = {};
          //        images['/static/images/image-old.png'] = json;
          //        json = Object.assign({images: images, version: this.version, confidentCutoff: this.confidentCutoff, platform: `${process.platform}:${process.arch}`, timestamp: Date.now()});
          //        jsonfile.writeFile(`${this.staticPath}/image.json`, json, {spaces: 2});
          //        this.renameFile(imageFile, `${this.imagePath}/image-old.png`);
          //      }, error: (err) => {
    
          //      }
          //    });    
          //  })
          //  .catch((e) => console.log(e))

          const image = readFileSync(imageFile);
          //const decodedImage = tfnode.node.decodeImage(new Uint8Array(image), 3);
          let decodedImage = tfnode.node.decodeImage(image, 3);
          let inputTensor;
          switch(this.version.type) {
            case 'float':
              inputTensor = decodedImage.expandDims(0).cast('float32');
              break;
            default:
              inputTensor = decodedImage.expandDims(0);
              break;
          }
          this.inference(inputTensor)
          .subscribe({
              next: (json) => {
              let images = {};
              images['/static/images/image-old.png'] = json;
              json = Object.assign({images: images, version: this.version, confidentCutoff: this.confidentCutoff, platform: `${process.platform}:${process.arch}`, timestamp: Date.now()});
              jsonfile.writeFile(`${this.staticPath}/image.json`, json, {spaces: 2});
              this.renameFile(imageFile, `${this.imagePath}/image-old.png`);
            }, error: (err) => {

            }
          });
        } catch(e) {
          console.log(e);
          unlinkSync(imageFile);
        }
      }  
    } catch(e) {
      console.log(e);
    }
  }
  checkVideo() {
    try {
      let video = this.getVideoFile(`${this.videoPath}/video`);
      if(!video) {
        return;
      }
      console.log('here')
      this.extractVideo(video)
      .subscribe((files: any) => {
        if(files.length > 0) {
          let images = files.filter((f) => f.indexOf('.jpg') > 0);
          let video = files.filter((f) => f.indexOf('.jpg') < 0);
          if(existsSync(video[0])) {
            console.log(video[0]);
            copyFileSync(video[0], './public/backup/video-old.mp4');
            unlinkSync(video[0]);
          }
          this.inferenceVideo(images);  
        }
      })
    } catch(e) {
      console.log(e);
    }
  }
  initialInference() {
    if(!existsSync(this.oldImage)) {
      copyFileSync(`${this.imagePath}/backup.png`, this.oldImage)
    }
    this.renameFile(this.oldImage, `${this.imagePath}/image.png`);
  }
  inference(inputTensor) {
    return new Observable((observer) => {
      try {
        const startTime = Date.now();
        // input_tensor worked for worker safety
        let input = this.version.input && this.version.input.length > 0 ? this.version.input : 'input_tensor';
        let tensor = {};
        tensor[input] = inputTensor; 
        console.log(input, tensor)
        let outputTensor = this.model.predict(tensor);
        const scores = outputTensor['detection_scores'].arraySync();
        const boxes = outputTensor['detection_boxes'].arraySync();
        const classes = outputTensor['detection_classes'].arraySync();
        const num = outputTensor['num_detections'].arraySync();
        const endTime = Date.now();
        outputTensor['detection_scores'].dispose();
        outputTensor['detection_boxes'].dispose();
        outputTensor['detection_classes'].dispose();
        outputTensor['num_detections'].dispose();
        
        let predictions = [];
        const elapsedTime = endTime - startTime;
        for (let i = 0; i < scores[0].length; i++) {
          let score = scores[0][i].toFixed(2);
          if (score >= this.confidentCutoff) {
            predictions.push({
              detectedBox: boxes[0][i].map((el)=>el.toFixed(2)),
              detectedClass: this.labels[classes[0][i]],
              detectedScore: score
            });
          }
        }
        console.log('predictions:', predictions.length, predictions[0]);
        console.log('time took: ', elapsedTime);
        console.log('build json...');
        observer.next({bbox: predictions, elapsedTime: elapsedTime});
        observer.complete();    
      } catch(e) {
        console.log(e)
        observer.error(e)
      }
    });
  }
  inferenceVideo(files) {
    try {
      let $inference = {};
      files.forEach(async (imageFile) => {
        if(existsSync(imageFile)) {
          console.log(imageFile)
          const image = readFileSync(imageFile);
          const decodedImage = tfnode.node.decodeImage(new Uint8Array(image), 3);
          const inputTensor = decodedImage.expandDims(0);
          $inference[imageFile.replace('./public/', '/static/')] = (this.inference(inputTensor));
        }
      })
      forkJoin($inference)
      .subscribe({
        next: (value) => {
          console.log(value);
          let json = Object.assign({}, {images: value, version: this.version, videoSrc: `${this.videoSrc}?${Date.now()}`, confidentCutoff: this.confidentCutoff, platform: `${process.platform}:${process.arch}`});
          jsonfile.writeFile(`${this.staticPath}/video.json`, json, {spaces: 2});
          // this.soundEffect(mp3s.theForce);  
        },
        complete: () => {
          console.log('complete');
        }
      });
    } catch(e) {
      console.log(e);
    }
  }
  extractVideo(file) {
  return new Observable((observer) => {
    observer.next()
    observer.complete()
  })
  //  return new Observable((observer) => {
  //    try {
  //      if(existsSync(file)) {
  //        console.log('$video', file)
  //        this.deleteFiles(this.videoPath, /.jpg|.png/);
  //        let process = new ffmpeg(file);
  //        process.then((video) => {
  //          video.fnExtractFrameToJPG(this.videoPath, {
  //            every_n_frames: 150,
  //            number: 5,
  //            keep_pixel_aspect_ratio : true,
  //            keep_aspect_ratio: true,
  //            file_name : `image.jpg`
  //          }, (err, files) => {
  //            if(!err) {
  //              console.log('video file: ', files);
  //              observer.next(files);
  //              observer.complete();        
  //            } else {
  //              console.log('video err: ', err);
  //              observer.next();
  //              observer.complete();    
  //            }
  //          })  
  //        }, (err) => {
  //          console.log('err: ', err);
  //          observer.next([]);
  //          observer.complete();
  //        })
  //      } else {
  //        console.log(`${file} not found`)
  //        observer.next([]);
  //        observer.complete();    
  //      }
  //    } catch(e) {
  //      console.log('error: ', e.msg);
  //      observer.next([]);
  //      observer.complete();
  //    }
  //  });
  }
  async checkNewModel () {
    let files = readdirSync(this.newModelPath);
    let list = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    console.log('here', files, list)
    if(list.length > 0) {
      clearInterval(this.timer);
      await this.loadModel(this.newModelPath);
      // this.setInterval(this.intervalMS);
    }
  }
  setInterval(ms) {
    this.timer = setInterval(async () => {
      let mmsFiles = this.checkMMS(); 
      if(mmsFiles && mmsFiles.length > 0) {
        clearInterval(this.timer);
        this.unzipMMS(mmsFiles)
        .subscribe(async () => {
          await this.checkNewModel();
          this.setInterval(this.intervalMS);
        }) 
      } else {
        await this.checkNewModel();
        this.checkImage();
      }
    }, ms);
  }
  checkMMS() {
    try {
      let list;
      let config;
      if(existsSync(this.mmsPath)) {
        list = readdirSync(this.mmsPath);
        list = list.filter(item => /(\.zip)$/.test(item));
        this.sharedPath = this.mmsPath;  
      } else if(existsSync(this.localPath)) {
        list = readdirSync(this.localPath);
        config = list.filter(item => item === 'config.json');
        list = list.filter(item => /(\.zip)$/.test(item));
        this.sharedPath = this.localPath;
      }
      this.checkVideo();
      return list;  
    } catch(e) {
      console.log(e)
    }
  }
  unzipMMS(files) {
    return new Observable((observer) => {
      let arg = '';
      console.log('list', files);
      files.forEach((file) => {
        if(file === 'model.zip') {
          arg = `unzip -o ${this.sharedPath}/${file} -d ${this.newModelPath} -x "__MACOSX/*"`;
        } else if(file === 'image.zip') {
          arg = `unzip -o ${this.sharedPath}/${file} -d ${this.imagePath} -x "__MACOSX/*"`;
        } else {
          observer.next();
          observer.complete();
        }
        this.shell(arg)
        .subscribe({
          complete: () => {
            if(existsSync(`${this.sharedPath}/${file}`)) {
              unlinkSync(`${this.sharedPath}/${file}`);
            }
            observer.next();
            observer.complete();
          }, error: (err) => {
            observer.next();
            observer.complete();
          }
        })
      })
    });    
  }  
  moveFiles(srcDir, destDir) {
    return new Observable((observer) => {
      let arg = `cp -r ${srcDir}/* ${destDir}`;
      if(srcDir === this.newModelPath) {
        arg += ` && rm -rf ${srcDir}/{,.[!.],..?}*`;
      }
      exec(arg, {maxBuffer: 1024 * 2000}, (err, stdout, stderr) => {
        if(!err) {
          observer.next();
          observer.complete();
        } else {
          console.log(err);
          observer.next();
          observer.complete();
        }
      });
    });    
  }
  getFiles(srcDir, ext) {
    let files = readdirSync(srcDir);
    return files.map((file) => {
      if(ext && file.match(ext)) {
        return `${srcDir}/${file}`;
      }
    });  
  }
  deleteFiles(srcDir, ext) {
    let files = readdirSync(srcDir);
    files.forEach((file) => {
      if(ext && file.match(ext)) {
        unlinkSync(`${this.videoPath}/${file}`)
      }
    });
  }
  removeFiles(srcDir) {
    let arg = `rm -rf ${srcDir}/*`;
    return this.shell(arg)
  }
  renameFile(from, to) {
    if(existsSync(from)) {
      renameSync(from, to);
    }    
  }
  shell(arg: string, success='command executed successfully', error='command failed', prnStdout=true, options={maxBuffer: 1024 * 2000}) {
    return new Observable((observer) => {
      console.log(arg);
      if(!prnStdout) {
        options = Object.assign(options, {stdio: 'pipe', encoding: 'utf8'})
      }
      exec(arg, options, (err: any, stdout: any, stderr: any) => {
        if(!err) {
          if(prnStdout) {
            console.log(stdout);
          }
          console.log(success);
          observer.next(stdout);
          observer.complete();
        } else {
          console.log(`${error}: ${err}`);
          observer.error(err);
        }
      })  
    });
  }
  async loadModel(modelPath) {
    //https://yu-ishikawa.medium.com/how-to-show-signatures-of-tensorflow-saved-model-5ac56cf1960f
    //https://www.tensorflow.org/guide/saved_model#show_command
    try {
      if(modelPath === this.newModelPath || modelPath === this.localPath) {
        let newVersion = jsonfile.readFileSync(`${modelPath}/assets/version.json`);
        if(this.version && this.version.version === newVersion.version && this.version.name === newVersion.name) {
          this.removeFiles(modelPath)
          .subscribe(() => {
            this.resetTimer();
          });
        } else {
          console.log('iam new')
          this.moveFiles(this.currentModelPath, this.oldModelPath)
          .subscribe({
            next: (v) => {
              this.moveFiles(this.newModelPath, this.currentModelPath)
              .subscribe({
                next: (v) => {
                  console.log('new model is available, restarting server...');
                  process.exit(0);                
                },   
                error: (e) => {
                  console.log('reset timer');
                  this.resetTimer(); 
                }
              })
            },  
            error: (e) => {
              console.log('reset timer');
              this.resetTimer(); 
            }
          })  
        }
      } else if(modelPath !== this.newModelPath){
        const startTime = Date.now();
        this.model = await tfnode.node.loadSavedModel(modelPath);
        const endTime = Date.now();

        console.log(`loading time:  ${modelPath}, ${endTime-startTime}`);
        this.labels = jsonfile.readFileSync(`${modelPath}/assets/labels.json`);
        this.version = jsonfile.readFileSync(`${modelPath}/assets/version.json`);
        console.log('version: ', this.version)

        let images = this.getFiles(this.videoPath, /.jpg|.png/);
        console.log(images)
        this.inferenceVideo(images);
        this.resetTimer();       
      }
    } catch(e) {
      console.log(e);
      //if(modelPath === this.newModelPath) {
      //  this.removeFiles(modelPath)
      //  .subscribe(() => {
      //    console.log('modelpath', modelPath)
      //    this.loadModel(this.currentModelPath);
      //  })
      //} else if(modelPath === this.currentModelPath) {
      //  this.loadModel(this.oldModelPath);
      //} else {
      //  console.log('PANIC! no good model to load');
      //}
      this.resetTimer();
    }
  }
}  