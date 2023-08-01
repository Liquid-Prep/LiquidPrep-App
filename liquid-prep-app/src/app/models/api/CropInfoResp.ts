import { BaseResponse } from './BaseResponse';

export interface PlantLocation {
  country: string;
  'state/province': string;
  'city/town': string;
  region: string;
}

export interface RootDepthRange {
  minDepth: number;
  maxDepth: number;
}

export interface PlantGrowthStage {
  stageNumber: number;
  stage: string;
  waterUse: number;
  stageLength: number;
  rootDepthRange: RootDepthRange;
}

export interface CropFacts {
  _id: string;
  index: number;
  cropName: string;
  type: string;
  plantBiologicalName: string;
  plantLocation: PlantLocation[];
  plantGrowthStages: {
    numberOfStages: number;
    growthStageLengthMeasure: string;
    totalGrowthStageLength: number;
    rootDepthMetric: string;
    stages: PlantGrowthStage[];
  };
}

export class CropInfoResp extends BaseResponse {
  data: {
    docs: CropFacts[];
    warning: string;
  };
  message: null;
}
