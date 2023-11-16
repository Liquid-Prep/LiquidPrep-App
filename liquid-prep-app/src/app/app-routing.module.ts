import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MyCropsComponent } from './components/my-crops/my-crops.component';
import { MeasureSoilComponent } from './components/measure-soil/measure-soil.component';
import { SeedDateComponent } from './components/seed-date/seed-date.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdviceComponent } from './components/advice/advice.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TestSensorComponent } from './components/test-sensor/test-sensor.component';
import { PastReadingsComponent } from './components/past-readings/past-readings.component';
import { CropStaticInfoResolver } from './resolve/CropStaticInfoResolver';
import { HomeComponent } from './components/dashboard/home/home.component';
import { FieldsComponent } from './components/dashboard/fields/fields.component';
import { SensorsComponent } from './components/dashboard/sensors/sensors.component';
import { SensorDetailsComponent } from './components/dashboard/sensors/sensor-details/sensor-details.component';
import { EditSensorComponent } from './components/dashboard/sensors/edit-sensor/edit-sensor.component';
import { WateringInsightsComponent } from './components/watering-insights/watering-insights.component';

import { DetailsComponent } from './components/dashboard/fields/details/details.component';
import { AddFieldComponent } from './components/dashboard/fields/add-field/add-field.component';
import { EditFieldComponent } from './components/dashboard/fields/edit-field/edit-field.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'sensors', component: SensorsComponent },
      { path: 'fields', component: FieldsComponent },
    ],
  },
  {
    path: 'select-crop',
    loadChildren: () =>
      import('./components/select-crop/select-crop.module').then(
        (m) => m.SelectCropModule
      ),
  },
  {
    path: 'my-crops',
    component: MyCropsComponent,
  },
  {
    path: 'insights/:id',
    component: WateringInsightsComponent,
  },
  {
    path: 'add-field',
    component: AddFieldComponent,
  },
  {
    path: 'edit-field',
    component: EditFieldComponent,
  },
  {
    path: 'details',
    component: DetailsComponent,
  },
  {
    path: 'measure-soil/:id',
    component: MeasureSoilComponent,
  },
  {
    path: 'seed-date/:id',
    component: SeedDateComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'advice/:id',
    component: AdviceComponent,
    resolve: {
      cropStaticInfo: CropStaticInfoResolver,
    },
  },
  {
    path: 'test-sensor',
    component: TestSensorComponent,
  },
  {
    path: 'past-readings',
    component: PastReadingsComponent,
  },
  {
    path: 'dashboard/sensors/:sensorId',
    component: SensorDetailsComponent,
  },
  {
    path: 'dashboard/sensors/edit/:sensorId',
    component: EditSensorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  providers: [CropStaticInfoResolver],
  exports: [RouterModule],
})
export class AppRoutingModule {}
