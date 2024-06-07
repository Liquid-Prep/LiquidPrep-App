import { CropFacts, PlantGrowthStage } from './api/CropInfoResp';

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
}

export class Measure {
  measureDate: Date;
  measureValue: number;
}
