import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MyCropsComponent } from './components/my-crops/my-crops.component';
import { MeasureSoilComponent } from './components/measure-soil/measure-soil.component';
import { SeedDateComponent } from './components/seed-date/seed-date.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AdviceComponent } from './components/advice/advice.component';
import { TestSensorComponent } from './components/test-sensor/test-sensor.component';
import { PastReadingsComponent } from './components/past-readings/past-readings.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent
  },
  {
    path: 'select-crop',
    loadChildren: () => import('./components/select-crop/select-crop.module')
      .then(m => m.SelectCropModule)
  },
  {
    path: 'my-crops',
    component: MyCropsComponent
  },
  {
    path: 'measure-soil/:id',
    component: MeasureSoilComponent
  },
  {
    path: 'seed-date/:id',
    component: SeedDateComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'advice/:id',
    component: AdviceComponent
  },
  {
    path: 'test-sensor',
    component: TestSensorComponent
  },
  {
    path: 'past-readings',
    component: PastReadingsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
