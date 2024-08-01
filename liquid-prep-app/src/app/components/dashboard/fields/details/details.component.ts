import {
  Component,
  Input,
  OnInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Location } from '@angular/common';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldDataService } from 'src/app/service/FieldDataService';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  headerConfig: HeaderConfig = {
    headerTitle: 'Field Details',
    leftIconName: 'close',
    rightIconName: 'delete',
    sortIconName: 'edit',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: this.openWarningDialog.bind(this),
    sortBtnClick: this.editField.bind(this),
  };
  id: string;
  @ViewChild('warningDialog') dialogTemplate!: TemplateRef<any>;

  fieldDetails: any;
  sensors: any[] = [];
  cropType: string;

  constructor(
    private headerService: HeaderService,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private fieldService: FieldDataService
  ) {
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.getFieldDetails(this.id);
  }

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    const navigation = this.router.getCurrentNavigation();
  }

  public handleLeftClick() {
    this.backToMyFields();
  }

  public openWarningDialog() {
    this.dialog.open(this.dialogTemplate);
  }

  public editField() {
    this.router.navigate([`/edit-field`], { queryParams: { id: this.id } });
  }

  public deleteField() {
    this.fieldService.removeFieldFromLocalStorage(this.id);
    this.router.navigate([`/dashboard/fields`]);
  }

  public async getFieldDetails(id: string) {
    this.fieldDetails = await this.fieldService.getFieldFromMyFieldById(id);
    this.sensors = this.fieldDetails.sensors;
    this.cropType = this.fieldDetails.crop.type;

    console.log(this.fieldDetails);
  }

  public adjustDate(timestamp: number) {
    return new Date(timestamp * 1000);
  }

  // public getFieldPhoto(type: string) {
  //   if (type === 'Corn') {
  //     return 'assets/crops-images/corn.png';
  //   } else if (type === 'Wheat') {
  //     return 'assets/crops-images/wheat.png';
  //   } else if (type === 'Cotton') {
  //     return 'assets/crops-images/cotton.png';
  //   } else if (type === 'Sorghum') {
  //     return 'assets/crops-images/sorghum.png';
  //   } else if (type === 'Soybean') {
  //     return 'assets/crops-images/soybean.png';
  //   } else {
  //     return 'assets/crops-images/missing.jpg';
  //   }
  // }

  public getFieldBannerPhoto(type: string) {
    if (type === 'Corn') {
      return 'bg-corn';
    } else if (type === 'Wheat') {
      return 'bg-wheat';
    } else if (type === 'Cotton') {
      return 'bg-cotton';
    } else if (type === 'Sorghum') {
      return 'bg-sorghum';
    } else if (type === 'Soybean') {
      return 'bg-soy';
    } else {
      return 'bg-default';
    }
  }

  public getThumbnailPhoto(type: string) {
    if (type === 'Corn') {
      return '/assets/crops-images/thumb-corn.jpg';
    } else if (type === 'Wheat') {
      return '/assets/crops-images/thumb-wheat.jpg';
    } else if (type === 'Cotton') {
      return '/assets/crops-images/thumb-cotton.jpg';
    } else if (type === 'Sorghum') {
      return '/assets/crops-images/thumb-sorghum.jpg';
    } else if (type === 'Soybean') {
      return '/assets/crops-images/thumb-soy.jpg';
    } else {
      return 'bg-default';
    }
  }

  public getCropType(type: string) {
    if (type === 'Corn') {
      return 'corn-pill';
    } else if (type === 'Wheat') {
      return 'wheat-pill';
    } else if (type === 'Cotton') {
      return 'cotton-pill';
    } else if (type === 'Sorghum') {
      return 'sorghum-pill';
    } else if (type === 'Soybean') {
      return 'soybean-pill';
    } else {
      return 'bg-default';
    }
  }

  public backToMyFields() {
    this.location.back();
  }
}
