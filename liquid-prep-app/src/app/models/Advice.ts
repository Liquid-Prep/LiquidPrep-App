import { SoilMoisture } from './SoilMoisture';
import {PlantGrowthStage} from './api/CropInfoResp';

export class Advice {
    id: string;
    cropName: string;
    stage: PlantGrowthStage;
    waterRecommended: number;
    temperature: number;
    weatherIconTemp: string;
    rainfallPercentage: number;
    rainfallIndex: string;
    wateringDecision: string;
    soilMoistureReading: SoilMoisture;
    imageUrl: string;
}
