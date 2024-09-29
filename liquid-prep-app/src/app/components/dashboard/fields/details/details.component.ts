import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Location } from '@angular/common';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldDataService } from 'src/app/service/FieldDataService';
import {CropDataService} from "../../../../service/CropDataService";
import {CropStaticInfo} from "../../../../models/CropStatic";
import {Field} from "../../../../models/Field";

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

  fieldDetails: Field;
  cropStatic: CropStaticInfo;
  sensors: any[] = [];

  constructor(
    private headerService: HeaderService,
    private location: Location,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private fieldService: FieldDataService,
    private cropService: CropDataService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.headerService.updateHeader(this.headerConfig);
    this.router.getCurrentNavigation();

    this.fieldDetails=this.fieldService.getFieldFromMyFieldById(this.id);
    this.sensors = this.fieldDetails.sensors;
    this.cropService.getCropStaticInfoById(this.fieldDetails.crop.id).then(cropStaticInfo => {
        this.cropStatic = cropStaticInfo;
    });
  }

  public handleLeftClick() {
    this.backToMyFields();
  }

  public openWarningDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(this.dialogTemplate);
  }

  public editField() {
    this.router.navigate([`/edit-field`], {queryParams: {id: this.id}}).then(r =>{});
   }

  public deleteField(): void {
    this.fieldService.removeFieldFromLocalStorage(this.id).then(r => {});
    this.router.navigate([`/dashboard/fields`]).then(r => {});
  }

  public adjustDate(timestamp: number) {
    return new Date(timestamp * 1000);
  }

  public getCropType(cropName: string) {
    if (cropName === 'Corn') {
      return 'corn-pill';
    } else if (cropName === 'Wheat') {
      return 'wheat-pill';
    } else if (cropName === 'Cotton') {
      return 'cotton-pill';
    } else if (cropName === 'Sorghum') {
      return 'sorghum-pill';
    } else if (cropName === 'Soybean') {
      return 'soybean-pill';
    } else {
      return 'bg-default';
    }
  }

  public backToMyFields() {
    this.location.back();
  }
}
