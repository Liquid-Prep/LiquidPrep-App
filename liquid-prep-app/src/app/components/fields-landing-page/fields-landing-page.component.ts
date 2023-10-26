import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { Router } from '@angular/router';
import { FieldDataService } from 'src/app/service/FieldDataService';

@Component({
  selector: 'app-fields-landing-page',
  templateUrl: './fields-landing-page.component.html',
  styleUrls: ['./fields-landing-page.component.scss'],
})
export class FieldsLandingPageComponent implements OnInit {
  headerConfig: HeaderConfig = {
    headerTitle: 'Fields',
    leftIconName: 'menu',
    rightIconName: 'cached',
    leftBtnClick: null,
    rightBtnClick: this.reload.bind(this),
  };

  fields: any[] = [];

  constructor(
    private headerService: HeaderService,
    private router: Router,
    private fieldService: FieldDataService
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.getFields();
  }

  public onFieldClick(id: string) {
    this.router.navigate([`/details`], {queryParams: {id: id}});
  }

  public async getFields() {
    const myFields = await  this.fieldService.getLocalStorageMyFields();
    this.fields = myFields;
  }

  public getFieldPhoto(type: string) {
    if (type === 'corn') {
      return 'assets/crops-images/corn.png'
    } else if (type === 'wheat') {
      return 'assets/crops-images/wheat.png'
    } else if (type === 'cotton') {
      return 'assets/crops-images/cotton.png'
    } else {
      return 'assets/crops-images/missing.jpg'
    }
  }

  public addField() {
    this.router.navigateByUrl(`add-field`);
  }

  public reload() {
    location.reload();
  }
}
