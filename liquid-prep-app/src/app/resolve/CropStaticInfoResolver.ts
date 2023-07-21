import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CropStaticInfo} from '../models/CropStatic';
import {Observable} from 'rxjs';
import {CropDataService} from '../service/CropDataService';
import {Injectable} from '@angular/core';

@Injectable()
export class CropStaticInfoResolver implements Resolve<CropStaticInfo>{

  constructor(private cropService: CropDataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<CropStaticInfo> | Promise<CropStaticInfo> | CropStaticInfo {
    const cropId = route.paramMap.get('id');
    return this.cropService.getCropStaticInfoById(cropId);
  }

}
