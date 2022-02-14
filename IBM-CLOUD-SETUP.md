# Configure and Deploy App in IBM Cloud Object Storage

The Liquid Prep App can be built and deployed in production for accessing the endpoint URL in any browser (recommended Chrome) to spin up the App in the browser.

Please follow the step wise instructions:

1. **Config.json**

   - In the `LiquidPrep-App/liquid-prep-app/src/` folder, rename the file `config-sample.json` to `config.json`.
   - Update the `config.json` with Liquid Prep Backend Service Endpoint noted down in the [Pre-requisites](#pre-requisites) 6th point.

2. **Build the App for production**

   - Start a terminal/CMD in `LiquidPrep-App/liquid-prep-app` folder.
   - Run `npm install`.
   - Run `npm run build-prod`.
   - The build artifacts will be created and stored in the `~/dist/liquid-prep-app` directory.

   **NOTE:** You can also build the App by executing Angular CLI command `ng build --prod` too.

3. **Deploy the App in [IBM Cloud Object Storage](<(https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-getting-started-cloud-object-storage)>)**

   - Log into your [IBM Cloud account](https://cloud.ibm.com/login).
   - Enter **Object Storage** in the search bar and select **Object Storage** from the results.
     <p align="middle">
         <img src="images/COS/cosSelect.PNG" width ="30%" height="30%">
     </p>

   - Select **Cloud Object Storage Lite** or **Cloud Object Storage Classic** based on your requirement and click **Create** button in bottom right.
     <p align="middle">
         <img src="images/COS/cosOption.PNG" width ="30%" height="30%">
     </p>

   - Next configure the Object Storage by selecting the right plan for your requirement, enter a service name, select a resource group and optionally enter a tag.
     <p align="middle">
         <img src="images/COS/cosConfig.PNG" width ="30%" height="30%">
     </p>

   - Now your Object Storage will be created and you will be routed to its dashboard. Select **Create bucket** tab and click on **Create Bucket** button.
     <p align="middle">
         <img src="images/COS/cosCreateBucket.PNG" width ="30%" height="30%">
     </p>

   - Configure the bucket by entering a **Unique bucket name**, select the required **Resiliency**, **Location** and **Storage class** options. Then configure **Static website hosting** by clicking **Add rule**, turn on the **Public access** switch and enter `index.html` for **Index document**. Finally click **Create Bucket** button end of the page.
     <p align="middle">
         <img src="images/COS/cosBucketConfig1.PNG" width ="30%" height="30%">
     </p>
     <p align="middle">
         <img src="images/COS/cosBucketConfig3.PNG" width ="30%" height="30%">
     </p>
     <p align="middle">
         <img src="images/COS/cosBucketConfig2.PNG" width ="30%" height="30%">
     </p>

   - Now a bucket will be created and shown in your Cloud Object Storage dashboard. Click on the bucket created.
     <p align="middle">
         <img src="images/COS/cosBucketCreated.PNG" width ="30%" height="30%">
     </p>

   - Click on the **Upload** button and upload all the contents in `dist/liquid-prep-app` directory which was created when you built the app.
     <p align="middle">
         <img src="images/COS/cosUpload.PNG" width ="30%" height="30%">
     </p>
   - Contents being uploaded from nested directories will need to prefixed with a path in the **Prefix for objects** field to create equivalent folders in object storage.
     E.g. **assets/crops-images/** for contents located in the crops-images directory.

   - Once uploading is complete, select **Configuration** for the bucket.
     <p align="middle">
         <img src="images/COS/cosAppURL1.PNG" width ="30%" height="30%">
     </p>

   - Scroll down to the very bottom of the page and you will find the URL endpoints for the App that can be shared to access the Liquid Prep App in the browser
     <p align="middle">
         <img src="images/COS/cosAppURL2.PNG" width ="30%" height="30%">
     </p>

### Important Notes

- Once a Bucket is created for a Cloud Object Storage, don't delete it. You can build your App with new changes and upload the `dist/liquid-prep-app` contents for the same Bucket. If you delete the Bucket you won't be able create another with the same name and you will have to wait for 7 days for the same name. Learn more about the [Cloud Object Storage delete bucket](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-compatibility-api-bucket-operations#compatibility-api-delete-bucket).
