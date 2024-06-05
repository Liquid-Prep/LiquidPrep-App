"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const http = __importStar(require("http"));
const liquid_prep_lib_1 = require("liquid-prep-lib");
const path_1 = __importDefault(require("path"));

// path of web socket
 const url = "http://192.168.4.222/moisture.json";
 const settings = { method: "Get" };
 let  moistureJSON;;

    // function to get moisture level from web socket
    function getMoistureLevel() {
        fetch(url, settings)
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then((json) => {
                moistureJSON = json;
          //      console.log(moistureJSON);
            });
            setTimeout(getMoistureLevel, 60000);


    }

class Server {
    constructor(port = 3000) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.apiUrl = `${process.env.SERVERLESS_ENDPOINT}`;
        this.initialise();
    }
    initialise() {
        let app = this.app;
        getMoistureLevel();
        const server = http.createServer(app);
        app.use((0, cors_1.default)({
            origin: '*'
        }));
        app.use((0, express_fileupload_1.default)());
        app.use('/static', express_1.default.static('public'));
        app.use('/', express_1.default.static('dist/liquid-prep-app'));
        app.get('/', (req, res, next) => {
            res.sendFile(path_1.default.resolve(__dirname, "index.html"));
            // next();
        });
        app.get("/staff", (req, res) => {
            res.json(["Jeff", "Gaurav"]);
        });
        app.get("/get_weather_info", (req, res, next) => {
            liquid_prep_lib_1.util.httpGet(`${this.apiUrl}/get_weather_info`)
                .subscribe({
                next: (data) => res.send(data),
                error: (err) => next(err)
            });
            // @ts-ignore
            // let weather = new Weather(req.query.weatherApiKey, req.query.geoCode, req.query.language, req.query.units);
            // let fiveDaysWeatherInfo = weather.get5DaysForecast();
            // res.send({data: fiveDaysWeatherInfo});
        });
        app.get("/get_crop_list", (req, res, next) => {
            liquid_prep_lib_1.util.httpGet(`${this.apiUrl}/get_crop_list`)
                .subscribe({
                next: (data) => res.send(data),
                error: (err) => next(err)
            });
        });
        app.get("/get_crop_info", (req, res, next) => {
            // @ts-ignore
            let id = req.query.id;
            liquid_prep_lib_1.util.httpGet(`${this.apiUrl}/get_crop_info?id=${id}`)
                .subscribe({
                next: (data) => res.send(data),
                error: (err) => next(err)
            });
        });
        // app.get("*",  (req: express.Request, res: express.Response) => {
        //   res.sendFile(
        //       path.resolve( __dirname, "index.html" )
        //   )
        // });
        app.listen(this.port, () => {
            console.log(`Started on ${this.port}`);
        });

        app.get("/moisture_level", (res) => {
            res.send(moistureJSON);
         //   console.log(`sent moisture level: ${moistureJSON}`);
        });
    }
}
exports.Server = Server;
