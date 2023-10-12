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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { SortModalComponent } from './components/sort-modal/sort-modal.component';
import { FieldsLandingPageComponent } from './components/fields-landing-page/fields-landing-page.component';
import { DetailsComponent } from './components/fields-landing-page/details/details.component';
import { AddFieldComponent } from './components/fields-landing-page/add-field/add-field.component';
import { EditFieldComponent } from './components/fields-landing-page/edit-field/edit-field.component';

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
    SortModalComponent,
    FieldsLandingPageComponent,
    DetailsComponent,
    AddFieldComponent,
    EditFieldComponent,
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
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    FormsModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
