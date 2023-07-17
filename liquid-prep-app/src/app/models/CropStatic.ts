export interface CropStaticInfoMapping {
  cropsMap: { [key: string]: CropStaticInfo };
}

export interface CropStaticInfo {
  cropName: string;
  type: string;
  url: string;
  immaturePic: string;
  harvestPic: string;
}
