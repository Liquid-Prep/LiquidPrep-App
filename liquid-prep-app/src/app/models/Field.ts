export class Field {
  id: string;
  fieldName: string;
  description?: string;
  crop: string; //Get Crop Data
  plantDate: Date;
  sensors?: any; // Get Sensor Data
}
