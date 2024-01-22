import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { Routes } from '@angular/router';

import {MainComponent} from './components/main.component';
import {CreatePoComponent} from './components/create-po.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'create', component: CreatePoComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withHashLocation())]
};
