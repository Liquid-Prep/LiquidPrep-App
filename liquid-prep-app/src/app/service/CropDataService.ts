import { Inject, Injectable } from '@angular/core';
import {from, Observable, Observer, of} from 'rxjs';
import { Crop } from '../models/Crop';
import { ImageMapping } from '../models/ImageMapping';
import { DataService } from './DataService';
import { HttpClient } from '@angular/common/http';
import {
  LOCAL_STORAGE,
  SESSION_STORAGE,
  StorageService,
} from 'ngx-webstorage-service';

import { DateTimeUtil } from '../utility/DateTimeUtil';
import { CropStaticInfo, CropStaticInfoMapping } from '../models/CropStatic';
import config from '../../config.json';
import {catchError, map, mergeMap, toArray} from 'rxjs/operators';
import {CropListResp} from '../models/api/CropListResp';
import {CropInfoResp, PlantGrowthStage} from '../models/api/CropInfoResp';

const CROP_LIST_KEY = 'crop-list';
const CROPS_STORAGE_KEY = 'my-crops';
const SELECTED_CROP_ID = 'selected-crop-id';

@Injectable({
  providedIn: 'root',
})
export class CropDataService {
  constructor(
    private http: HttpClient,
    @Inject(LOCAL_STORAGE) private localStorage: StorageService,
    @Inject(SESSION_STORAGE) private sessionStorage: StorageService,
    private dataService: DataService
  ) {}

  private cropsListAPIUrl = config.backendAPIEndpoint + '/crop/list';
  private cropInfoAPIUrl = config.backendAPIEndpoint + '/crop/';
  private cropImageMappingFile = '/assets/json/cropImageMapping.json';
  private defaultImage = '../assets/crops-images/missing.jpg';
  private stageImageMappingFile = '../assets/json/cropGrowthStageImageMapping.json';
  private cropStaticInfoFile = 'assets/json/CropStaticInfoMapping.json';

  private crop: Crop; // used for passing data between components

  public getCropsListData(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.dataService.getCropsList().subscribe(
        (cropsList: any) => {
          const cropListData = cropsList.data.docs;
          // Map the crop images
          if (cropListData) {
            cropListData.map((crop) => {
              crop.id = crop._id;
              this.fetchCropListImage(crop);
            });
            this.storeCropListInSession(cropListData);
            const filteredCropList = this.filterOutExistingCrops(cropListData);
            observer.next(filteredCropList);
            observer.complete();
          } else {
            observer.error('crops list is null or empty');
          }
        },
        (err) => {
          observer.error(
            'Error getting crop data: ' + (err.message ? err.message : err)
          );
        }
      );
    });
  }

  public getCropData(id): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.dataService.getCropInfo(id).subscribe(
        (cropInfo: any) => {
          const cropData: Crop = cropInfo.data.docs[0];
          if (cropData) {
            cropData.id = cropInfo.data.docs[0]._id;
            this.fetchCropStageImages(cropData);
            observer.next(cropData);
            observer.complete();
          } else {
            observer.error('crops data is null or empty');
          }
        },
        (err) => {
          observer.error(
            'Error getting crop data: ' + (err.message ? err.message : err)
          );
        }
      );
    });
  }

  // store crops list in session storage
  public storeCropListInSession(cropsListData) {
    this.getCropListFromSessionStorage().subscribe(
      (cropsList: Crop[]) => {
        if (cropsList === undefined || cropsList.length === 0) {
          this.sessionStorage.set(CROP_LIST_KEY, cropsListData);
        } else {
          console.log('crop list already stored in session storage.');
        }
      },
      (err) => {
        console.error(
          'Error storing crop data: ' + (err.message ? err.message : err)
        );
      }
    );
  }

  // check if crops list exits in session storage else return empty list
  public getCropListFromSessionStorage(): Observable<Crop[]> {
    return of(this.sessionStorage.get(CROP_LIST_KEY) || this.getEmptyMyCrops());
  }

  // check if my-crops list exists in local storage else return empty list
  public getMyCropsFromLocalStorage(): Observable<Crop[]> {
    return of(
      this.localStorage.get(CROPS_STORAGE_KEY) || this.getEmptyMyCrops()
    );
  }

  public getLocalStorageMyCrops(): Promise<Crop[]> {
    return Promise.resolve(this.localStorage.get(CROPS_STORAGE_KEY) || this.getEmptyMyCrops());
  }

  // check if my-crops list exists in local storage else return empty list
  public getMyCrops(): Observable<Crop[]> {
    return new Observable((observer: Observer<any>) => {
      let crops = [];
      this.getMyCropsFromLocalStorage().subscribe(
        (myCrops: any) => {
          if (myCrops.length !== 0) {
            myCrops.map((crop) => {
              crop.id = crop._id;
              this.fetchCropListImage(crop);
            });
            crops = myCrops;
          }
          observer.next(crops);
          observer.complete();
        },
        (err) => {
          observer.error(
            'Error storing crop data: ' + (err.message ? err.message : err)
          );
        }
      );
    });
  }

  // Filter out crops which are already existing in my-crops list stored locally
  public filterOutExistingCrops(cropsListData: Crop[]) {
    let filteredCropList = new Array<Crop>();
    this.getMyCrops().subscribe((storedCrops) => {
      if (storedCrops !== undefined || storedCrops.length !== 0) {
        storedCrops.forEach((eachStoredCrop) => {
          cropsListData.forEach((eachCropData, index) => {
            if (eachCropData.id === eachStoredCrop.id) {
              cropsListData.splice(index, 1);
            }
          });
        });
        filteredCropList = cropsListData;
      } else {
        filteredCropList = cropsListData;
      }
    });
    return filteredCropList;
  }

  public async storeMyCropsInLocalStorage(crop: Crop) {
    try {
      const myCrops = await this.getLocalStorageMyCrops();
      const cropStaticInfo = await this.getCropStaticInfoById(crop.id);
      crop.url = cropStaticInfo.url;
      if (myCrops.length === 0) {
        myCrops.push(crop);
      } else {
        const existingCropIndex = myCrops.findIndex((eachCrop) => eachCrop.id === crop.id);
        if (existingCropIndex === -1) {
          myCrops.push(crop);
        } else {
          myCrops[existingCropIndex] = crop;
        }
      }

      this.localStorage.set(CROPS_STORAGE_KEY, myCrops);
    } catch (error) {
      throw new Error('Error storing crop data: ' + (error.message ? error.message : error));
    }
  }

  public async removeCropFromLocalStorage(cropId: string) {
    try {
      const myCrops = await this.getLocalStorageMyCrops();
      const existingCropIndex = myCrops.findIndex((eachCrop) => eachCrop.id === cropId);

      if (existingCropIndex !== -1) {
        myCrops.splice(existingCropIndex, 1);
        this.localStorage.set(CROPS_STORAGE_KEY, myCrops);
      }
    } catch (error) {
      throw new Error('Error removing crop data: ' + (error.message ? error.message : error));
    }
  }

  public getCropImageMapping(): Observable<ImageMapping> {
    return new Observable((observer: Observer<ImageMapping>) => {
      this.http.get<ImageMapping>(this.cropImageMappingFile).subscribe(
        (data) => {
          observer.next(data);
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public getCropGrowthStageImageMapping(): Observable<ImageMapping> {
    return new Observable((observer: Observer<ImageMapping>) => {
      this.http
        .get<ImageMapping>(this.stageImageMappingFile)
        .subscribe((data) => {
          observer.next(data);
          observer.complete();
        });
    });
  }

  private fetchCropStageImages(crop: Crop) {
    this.getCropGrowthStageImageMapping().subscribe(
      (cropGrowthStageImageMapping: ImageMapping) => {
        if (cropGrowthStageImageMapping != null) {
          if (crop.cropGrowthStage) {
            crop.cropGrowthStage.stages.forEach((stage) => {
              const stageUrl =
                cropGrowthStageImageMapping.cropStageMap[
                  stage.stageNumber.toString()
                ].url;
              stage.url = stageUrl;
            });
          }
        } else {
          if (crop.cropGrowthStage) {
            crop.cropGrowthStage.stages.forEach((stage) => {
              const stageUrl =
                '../assets/crops-images/stage' + stage.stageNumber + '.png';
              stage.url = stageUrl;
            });
          }
        }
      },
      (err) => {
        console.error('fetchCropStageImages', err);
      }
    );
  }

  private fetchCropListImage(crop: Crop) {
    this.getCropImageMapping().subscribe(
      (cropImageMapping: ImageMapping) => {
        if (cropImageMapping != null && cropImageMapping.cropsMap[crop.id]) {
          crop.url = cropImageMapping.cropsMap[crop.id].url;
        } else {
          crop.url = this.defaultImage;
        }
      },
      (err) => {
        console.error('fetchCropListImage', err, crop);
      }
    );
  }

  private getEmptyMyCrops(): Crop[] {
    const emptyArray: Crop[] = [];
    return emptyArray;
  }

  public getCropFromMyCropById(id: string) {
    return this.localStorage
      .get(CROPS_STORAGE_KEY)
      .find((crop) => crop.id === id);
  }

  public async getCropFromMyCropByIdAsync(id: string): Promise<Crop | undefined> {
    try {
      const myCrops = await this.getLocalStorageMyCrops();
      return myCrops.find((crop) => crop.id === id);
    } catch (error) {
      console.error('Error getting crop with id ${id} from My Crops:', error);
      return undefined;
    }
  }

  public getPlantingDays(crop: Crop){
    const today = new DateTimeUtil().getTodayDate();
    const seedingDate = new Date(crop.seedingDate);
    return Math.floor(Math.abs(today.getTime() - seedingDate.getTime()) / (1000 * 3600 * 24));
  }

  public generateCropGrowthStage(crop: Crop) {
    if (crop.seedingDate === undefined) {
      console.error('Crop', crop.cropName, 'has not been planted');
      return null;
    }

    let stage: PlantGrowthStage;
    const numberOfDaysFromSeedingDate = this.getPlantingDays(crop);
    const stages: PlantGrowthStage[] = crop.facts.plantGrowthStages.stages;
    const cummulativeStagesLength: number[] = [stages[0].stageLength];

    for (let i = 1; i < stages.length; i++) {
      cummulativeStagesLength[i] =
        cummulativeStagesLength[i - 1] + stages[i].stageLength;
    }

    for (let i = 0; i < stages.length; i++) {
      if (numberOfDaysFromSeedingDate <= cummulativeStagesLength[i]) {
        stage = stages[i];
        break;
      } else {
        stage = stages[i];
      }
    }
    // stage.age = numberOfDaysFromSeedingDate;
    return stage;
  }

  public storeSelectedCropIdInSession(cropId: string) {
    if (cropId) {
      this.sessionStorage.set(SELECTED_CROP_ID, cropId);
    } else {
      console.error(
        'storeSelectedCropIdInSession',
        'cropId should NOT be null'
      );
    }
  }

  public getSelectedCropIdInSession() {
    return this.sessionStorage.get(SELECTED_CROP_ID);
  }

  public getSelectCrop(): Crop {
    return this.getCropFromMyCropById(this.getSelectedCropIdInSession());
  }

  public getCropStaticInfoById(id: string): Promise<CropStaticInfo> {
    return new Promise<CropStaticInfo>((resolve, reject) => {
      this.http.get<CropStaticInfoMapping>(this.cropStaticInfoFile).toPromise().then((response) => {
        const cropStaticInfoMapping = response.cropsMap[id];
        if (!cropStaticInfoMapping) {
          reject(new Error(`CropStaticInfo with id ${id} not found`));
        } else {
          resolve(cropStaticInfoMapping as CropStaticInfo);
        }
      }).catch((error) => {
        reject(error);
      });
    });
  }

  public getCropListFromApi(): Observable<Crop[]> {
    return this.http.get<CropListResp>(this.cropsListAPIUrl).pipe(
      mergeMap((response: CropListResp) => {
        const data = response.data;
        if (data && data.docs && data.docs.length > 0) {
          const cropObservables: Observable<Crop>[] = data.docs.map((item: any) => {
            return from(this.getCropStaticInfoById(item._id)).pipe(
              map((staticInfo) => {
                const imageUrl = staticInfo ? staticInfo.url : this.defaultImage;
                return {
                  id: item._id,
                  cropName: item.cropName,
                  type: '',
                  cropGrowthStage: null,
                  url: imageUrl,
                  facts: null,
                  seedingDate: null,
                  stage: null
                } as Crop;
              }),
              catchError((error) => {
                console.error('Error getting crop static info:', error);
                return [];
              })
            );
          });

          return from(cropObservables).pipe(
            mergeMap((cropObservable) => cropObservable),
            toArray()
          );
        } else {
          return [];
        }
      }),
      catchError((error) => {
        console.error('Error getting crop list:', error);
        return [];
      })
    );
  }

  public getCropInfo(cropId: string): Observable<CropInfoResp> {
    const url = this.cropInfoAPIUrl + cropId;

    return new Observable((observer: Observer<CropInfoResp>) => {
      this.http.get<CropInfoResp>(url).subscribe(
        (response: CropInfoResp) => {
          if (response.status === 'success' && response.statusCode === 200) {
            observer.next(response);
            observer.complete();
          }else{
            console.error('Error getting CropInfo:', cropId, response.message);
            observer.error(response.message);
          }
        },
        (error) => {
          console.error('Error getting CropInfo:', error);
          observer.error('Something went wrong. Please try again later.');
          observer.complete();
        }
      );
    });
  }

  public setCrop(crop: Crop): void {
    this.crop = crop;
  }

  public getCrop(): Crop {
    return this.crop;
  }
}

