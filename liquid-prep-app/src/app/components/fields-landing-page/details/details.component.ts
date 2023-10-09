import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderService } from 'src/app/service/header.service';
import { HeaderConfig } from 'src/app/models/HeaderConfig.interface';
import { MatDialog } from '@angular/material/dialog';

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
    leftBtnClick: this.handleLeftClick.bind(this),
    rightBtnClick: this.openWarningDialog.bind(this),
  };

  @ViewChild('warningDialog') dialogTemplate!: TemplateRef<any>;

  private id = 'sadsadasd';

  constructor(
    private headerService: HeaderService,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.headerService.updateHeader(this.headerConfig);
  }

  public handleLeftClick() {
    this.backToMyFields();
  }

  public openWarningDialog() {
    console.log('Delete');
    this.dialog.open(this.dialogTemplate);
  }

  public deleteField() {
    console.log('Deleted');
  }

  public backToMyFields() {
    this.location.back();
  }
}
