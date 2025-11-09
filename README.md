# [Liquid Prep - App](https://liquidprep-app-dev.s3-web.jp-tok.cloud-object-storage.appdomain.cloud/)

The Liquid Prep App is a user interface that is accessed on your mobile device to receive watering guidance for a selected crop. It is a [progressive web app (PWA)](https://web.dev/progressive-web-apps/) developed with an [Angular](https://angular.io/) web framework.

The app gets weather and crops data from the [Liquid Prep Backend](https://github.com/Liquid-Prep/LiquidPrep-Backend) service, and the soil moisture data from the [Liquid Prep Hardware](https://github.com/Liquid-Prep/LiquidPrep-Hardware). After the analysis of weather, crop and soil moisture data, the app computes and provides water advice for your crop.

The Liquid Prep App can be run on your local machine for development and testing purposes, and is deployed on [IBM Cloud Object Storage](https://www.ibm.com/ca-en/cloud/object-storage) for production to be accessed globally.

[![Click](https://img.shields.io/badge/Click-Liquid%20%20Prep%20App-blue)](https://liquidprep-app-dev.s3-web.jp-tok.cloud-object-storage.appdomain.cloud/)

## Get Started

Instructions on how to run the app:

- [Prerequisites](#pre-requisites)
- [Run App Locally](#run-app-locally)
- [Configure and Deploy in IBM Cloud Object Storage](#configure-and-deploy-app-in-ibm-cloud-object-storage)
- [Contributing](#contributing)

### Prerequisites

1. Node and NPM:
   - [Install Node and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Angular CLI
   - [Install Angular CLI](https://cli.angular.io/)
3. Git:
   - [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)
   - [Configure Git](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup)
   - [Git account setup and configuration](https://git-scm.com/book/en/v2/GitHub-Account-Setup-and-Configuration)
4. Liquid Prep project:
   - [Git-clone Liquid Prep project](https://github.com/Liquid-Prep/Liquid-Prep)
5. IBM Cloud account:
   - [Create an IBM Cloud account](https://cloud.ibm.com/registration)
6. Liquid Prep Backend Service Endpoint:
   - [Deploy Liquid Prep Backend in IBM Cloud Functions](https://github.com/Liquid-Prep/LiquidPrep-Backend#liquid-prep---backend-service) and note down the `CLOUD_FUNCTIONS_URL` which is the Backend service endpoint. This endpoint will be required later for deploying the App.

### Run App Locally

1. **Build the App**

   - Start a terminal/CMD in `LiquidPrep-App/liquid-prep-app` folder.
   - Run `npm install`.

2. **Config.json**

   - In the `LiquidPrep-App/liquid-prep-app/src/` folder, rename the file `config-sample.json` to `config.json`.
   - Update the `config.json` with Liquid Prep Backend Service Endpoint noted down in the [Pre-requisites](#pre-requisites) 6th point.

3. **Run the App**

   - Run `npm start`.
   - Open the browser and enter `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

   **Note:** You can also run the app by executing Angular CLI command `ng serve`.

### Configure and Deploy the App in IBM Cloud Object Storage

The Liquid Prep App can be built and deployed in production for accessing the endpoint URL in any browser (we recommend Chrome).

Follow the stepwise instructions in the [IBM Cloud Deployment Documentation](IBM-CLOUD-SETUP.md).

## Contributing

For details on our code of conduct, areas where we'd like to see community contributions, and the process for submitting pull requests to the project, see [CONTRIBUTING.md](https://github.com/Liquid-Prep/Liquid-Prep/blob/main/CONTRIBUTING.md).

## License

Unless otherwise noted, this project is licensed under the Apache 2 License - see the [LICENSE](https://github.com/Liquid-Prep/Liquid-Prep/blob/main/LICENSE) file for details.
