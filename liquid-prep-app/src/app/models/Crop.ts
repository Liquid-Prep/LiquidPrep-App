import {CropFacts, CropInfoResp, PlantGrowthStage} from './api/CropInfoResp';
import {CropDataService} from "../service/CropDataService";

export class Crop {
  id?: string;
  cropName?: string;
  type?: string;
  url?: string; // crop image mapping url
  facts?: CropFacts;
  seedingDate?: Date;
  waterDate?: Date;
  measureRecord?: Measure[];
  stage?: PlantGrowthStage;

  public fetchCropInfoIfNeeded(cropService: CropDataService): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.facts) {
        cropService.getCropInfo(this.id).subscribe(
          (resp: CropInfoResp) => {
            this.id = resp.data.docs[0]._id;
            this.cropName = resp.data.docs[0].cropName;
            this.facts = resp.data.docs[0]; // Assuming the whole response is CropFacts
            resolve(); // load data success -> resolve
          },
          (error) => {
            alert('fetchCropInfoIfNeeded Could not get crop info: ' + error);
            console.error('fetchCropInfoIfNeeded Error getting CropInfo:', error);
            reject(error); // load data fail -> reject
          }
        );
      } else {
        resolve(); // facts exist -> resolve
      }
    });
  }


}

export class Measure {
  measureDate: Date;
  measureValue: number;
}
