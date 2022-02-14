# [Liquid Prep - App](https://liquid-prep-app.s3-web.us-east.cloud-object-storage.appdomain.cloud/)

[![Click](https://img.shields.io/badge/Click-Liquid%20%20Prep%20App-blue)](https://liquid-prep-app.s3-web.us-east.cloud-object-storage.appdomain.cloud/)

Liquid Prep App is an user interface that is accessed on your mobile device to get water advise for the selected crop. It is a [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/) developed with [Angular](https://angular.io/) web framework.

The Liquid Prep App gets the Weather and Crops data from the [Liquid Prep Backend](https://github.com/Liquid-Prep/LiquidPrep-Backend) service and the soil moisture data from the [Liquid Prep Hardware](https://github.com/Liquid-Prep/LiquidPrep-Hardware). After analysis of the weather, crop and soil moisture data the app computes and provides water advise for the selected crop.

The Liquid Prep App can be run on your local machine for development and testing purpose. And it is deployed on [IBM Cloud Object Storage](https://www.ibm.com/ca-en/cloud/object-storage) for production to be accessed globally.

**[Click to access Liquid Prep App](https://liquid-prep-app.s3-web.us-east.cloud-object-storage.appdomain.cloud/)**

## Get Started

Instructions on how to run the App,

- [Liquid Prep - App](#liquid-prep---app)
  - [Get Started](#get-started)
  - [Pre-requisites](#pre-requisites)
  - [Run App Locally](#run-app-locally)
  - [Configure and Deploy App in IBM Cloud Object Storage](#configure-and-deploy-app-in-ibm-cloud-object-storage)
  - [Contributing](#contributing)
  - [License](#license)

## Pre-requisites

1. Node and NPM:
   - [Install Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Angular CLI
   - [Install Angular CLI](https://cli.angular.io/)
3. Git:
   - [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)
   - [Configure Git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
   - [Git account setup and configuration](https://git-scm.com/book/en/v2/GitHub-Account-Setup-and-Configuration)
4. Liquid Prep project:
   - [Git clone Liquid Prep project](https://github.com/Liquid-Prep/Liquid-Prep)
5. IBM Cloud account:
   - [Create an IBM Cloud account](https://cloud.ibm.com/registration)
6. Liquid Prep Backend Service Endpoint:
   - [Deploy Liquid Prep Backend in IBM Cloud Functions](https://github.com/Liquid-Prep/Liquid-Prep/tree/master/backend#deploy-liquid-prep-backend-service) and note down the `CLOUD_FUNCTIONS_URL` which is the Backend service endpoint. This endpoint will be required later for deploying the App.

## Run App Locally

1. **Build the App**

   - Start a terminal/CMD in `LiquidPrep-App/liquid-prep-app` folder.
   - Run `npm install`.

2. **Config.json**

   - In the `LiquidPrep-App/liquid-prep-app/src/` folder, rename the file `config-sample.json` to `config.json`.
   - Update the `config.json` with Liquid Prep Backend Service Endpoint noted down in the [Pre-requisites](#pre-requisites) 6th point.

3. **Run the App**

   - Run `npm start`.
   - Open the browser and enter `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

   **NOTE:** You can also run the App by executing Angular CLI command `ng serve` too.

## Configure and Deploy App in IBM Cloud Object Storage

The Liquid Prep App can be built and deployed in production for accessing the endpoint URL in any browser (recommended Chrome) to spin up the App in the browser.

Please follow the step wise instructions in the [IBM Cloud Deployment Documentation](IBM-CLOUD-SETUP.md).

## Contributing

Please read [CONTRIBUTING.md](https://github.com/Liquid-Prep/Liquid-Prep/blob/main/CONTRIBUTING.md) for details on our code of conduct, areas where we'd like to see community contributions, and the process for submitting pull requests to the project.

## License

Unless otherwise noted, this project is licensed under the Apache 2 License - see the [LICENSE](https://github.com/Liquid-Prep/Liquid-Prep/blob/main/LICENSE) file for details.
