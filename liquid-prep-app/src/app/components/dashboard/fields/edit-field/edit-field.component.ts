import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate, Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FieldDataService } from 'src/app/service/FieldDataService';
import { Guid } from 'guid-typescript';
import { Field } from 'src/app/models/Field';

@Component({
  selector: 'app-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss'],
})
export class EditFieldComponent implements OnInit {
  headerConfig: HeaderConfig = {
    headerTitle: 'Edit Field',
    leftIconName: 'arrow_back',
    rightIconName: 'save',
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: this.save.bind(this),
  };
  id: string;
  fieldForm: FormGroup;
  fieldDetails: any;

  constructor(
    private headerService: HeaderService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private fieldService: FieldDataService
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
    this.loadForm();
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.getFieldDetails(this.id);
  }

  loadForm() {
    this.fieldForm = new FormGroup({
      fieldName: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      crop: new FormControl(null, [Validators.required]),
      plantDate: new FormControl(null, [Validators.required]),
    });
  }

  public handleLeftClick(data: string) {
    this.location.back();
  }

  public patchFieldValue() {
    this.fieldForm.patchValue({
      fieldName: this.fieldDetails.fieldName,
      description: this.fieldDetails.description,
      crop: this.fieldDetails.crop,
      plantDate: this.fieldDetails.plantDate,
    });
  }

  public async getFieldDetails(id: string) {
    this.fieldDetails = await this.fieldService.getFieldFromMyFieldById(id);
    this.patchFieldValue();
  }

  public save() {
    //TODO
    let formattedDate, description;
    const name = this.fieldForm.get('fieldName').value;
    if (this.fieldForm.get('description').value) {
      description = this.fieldForm.get('description').value;
    }
    const crop = this.fieldForm.get('crop').value;
    const plantDateValue = this.fieldForm.get('plantDate').value;
    if (plantDateValue instanceof Date) {
      formattedDate = formatDate(plantDateValue, 'yyyy-MM-dd', 'en-US');
    } else {
      console.error('plantDate is not a Date object');
    }
    const id = this.id;
    const params: Field = {
      id,
      fieldName: name,
      description: description || undefined,
      crop, //Get Crop Data
      plantDate: new Date(formattedDate),
    };
    this.fieldService.storeFieldsInLocalStorage(params);
    this.router.navigate([`/dashboard/fields`]);
  }
}
