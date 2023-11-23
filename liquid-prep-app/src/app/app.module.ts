import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MyCropsComponent } from './components/my-crops/my-crops.component';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
  SwiperModule,
  SwiperConfigInterface,
  SWIPER_CONFIG,
} from 'ngx-swiper-wrapper';
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

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  observer: true,
  direction: 'horizontal',
  threshold: 50,
  spaceBetween: 5,
  slidesPerView: 1,
  centeredSlides: true,
};

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
    SwiperModule,
    FlexLayoutModule,
    MatGridListModule,
    MatToolbarModule,
    MatDialogModule,
    MatMenuModule,
  ],
  providers: [
    DataService,
    DatePipe,
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG,
    },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
