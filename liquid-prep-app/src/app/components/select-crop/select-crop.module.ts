import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SelectCropRoutingModule } from './select-crop-routing.module';
import { SelectCropComponent } from './select-crop.component';
import { MaterialModule } from '../../material/material.module';
import { FormsModule } from '@angular/forms';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';


@NgModule({
  declarations: [SelectCropComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        SelectCropRoutingModule,
        MaterialModule,
        FormsModule,
        MatProgressSpinnerModule
    ]
})
export class SelectCropModule { }
