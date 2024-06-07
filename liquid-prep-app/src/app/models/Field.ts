import { Crop } from './Crop';

export class Field {
  id: string;
  fieldName: string;
  description?: string;
  crop: Crop; //Get Crop Data, one field-one crop
  plantDate: Date;
  sensors?: any; // Get Sensor Data
  soil: string;
}
