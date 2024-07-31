import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MyCropsComponent } from './components/my-crops/my-crops.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';

import { register } from 'swiper/element/bundle';
register();
import { MeasureSoilComponent } from './components/measure-soil/measure-soil.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdviceComponent } from './components/advice/advice.component';
import { SeedDateComponent } from './components/seed-date/seed-date.component';
import { DataService } from './service/DataService';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { SlideIndicatorComponent } from './components/slide-indicator/slide-indicator.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TestSensorComponent } from './components/test-sensor/test-sensor.component';
import { HeaderTitleComponent } from './components/header-title/header-title.component';
import { PastReadingsComponent } from './components/past-readings/past-readings.component';
import { DeleteCropComponent } from './components/delete-crop/delete-crop.component';
import { HamburgerMenuComponent } from './components/hamburger-menu/hamburger-menu.component';
import { HomeComponent } from './components/dashboard/home/home.component';
import { FieldsComponent } from './components/dashboard/fields/fields.component';
import { SensorsComponent } from './components/dashboard/sensors/sensors.component';
import { SelectModalComponent } from './components/select-modal/select-modal.component';
import { SensorDetailsComponent } from './components/dashboard/sensors/sensor-details/sensor-details.component';
import { EditSensorComponent } from './components/dashboard/sensors/edit-sensor/edit-sensor.component';
import { SensorLocatorModalComponent } from './components/sensor-locator-modal/sensor-locator-modal.component';
import { UnsavedChangesModalComponent } from './components/unsaved-changes-modal/unsaved-changes-modal.component';
import { WaterConfirmDialogComponent } from './components/dashboard/home/water-confirm-dialog.component';
import { WateringInsightsComponent } from './components/watering-insights/watering-insights.component';
import { MoistureLogsComponent } from './components/watering-insights/moisture-logs/moisture-logs.component';
import { DetailsComponent } from './components/dashboard/fields/details/details.component';
import { AddFieldComponent } from './components/dashboard/fields/add-field/add-field.component';
import { EditFieldComponent } from './components/dashboard/fields/edit-field/edit-field.component';
import { SensorListComponent } from './components/dashboard/fields/sensor-list/sensor-list.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { SwiperDirectiveDirective } from './directives/swiper-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MyCropsComponent,
    MeasureSoilComponent,
    SettingsComponent,
    AdviceComponent,
    SeedDateComponent,
    DateAgoPipe,
    SlideIndicatorComponent,
    DashboardComponent,
    TestSensorComponent,
    HeaderTitleComponent,
    PastReadingsComponent,
    DeleteCropComponent,
    HamburgerMenuComponent,
    HomeComponent,
    FieldsComponent,
    SensorsComponent,
    SelectModalComponent,
    DetailsComponent,
    AddFieldComponent,
    EditFieldComponent,
    SensorDetailsComponent,
    EditSensorComponent,
    SensorLocatorModalComponent,
    UnsavedChangesModalComponent,
    WaterConfirmDialogComponent,
    WateringInsightsComponent,
    MoistureLogsComponent,
    SensorListComponent,
    SplashScreenComponent,
    SwiperDirectiveDirective,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    BrowserAnimationsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSortModule,
    MatTooltipModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    FormsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatGridListModule,
    MatToolbarModule,
    MatDialogModule,
    MatMenuModule,
  ],
  providers: [
    DataService,
    DatePipe,
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule {}
