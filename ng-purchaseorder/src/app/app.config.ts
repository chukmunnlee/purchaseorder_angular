import { ApplicationConfig } from '@angular/core';
import { CanDeactivateFn, provideRouter, withHashLocation } from '@angular/router';
import { Routes } from '@angular/router';

import {MainComponent} from './components/main.component';
import {CreatePoComponent} from './components/create-po.component';
import {PurchaseOrderService} from './purchaseorder.service';
import {provideComponentStore} from '@ngrx/component-store';
import {PurchaseOrderStore} from './purchaseorder.store';

export interface CanLeaveRoute {
  canLeave(): boolean
  message(): string
}

const canLeave: CanDeactivateFn<CanLeaveRoute> =
  (comp: CanLeaveRoute, _activateRouteSnapshot, _currState, _nextState) => {
    if (comp.canLeave())
      return true
    return confirm(comp.message())
  }

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'create', component: CreatePoComponent, canDeactivate: [ canLeave ] },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()), provideComponentStore(PurchaseOrderStore),
    PurchaseOrderService
  ]
};
