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
    this.router.navigate([`/fields`]);
  }

  public async getFieldDetails(id: string) {
    this.fieldDetails = await this.fieldService.getFieldFromMyFieldById(id);
  }

  public getFieldPhoto(type: string) {
    if (type === 'corn') {
      return 'assets/crops-images/corn.png';
    } else if (type === 'wheat') {
      return 'assets/crops-images/wheat.png';
    } else if (type === 'cotton') {
      return 'assets/crops-images/cotton.png';
    } else {
      return 'assets/crops-images/missing.jpg';
    }
  }

  public backToMyFields() {
    this.location.back();
  }
}
