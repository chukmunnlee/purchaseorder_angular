import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { CanDeactivateFn, provideRouter, withHashLocation } from '@angular/router';
import { Routes } from '@angular/router';

import {MainComponent} from './components/main.component';
import {CreatePoComponent} from './components/create-po.component';
import {PurchaseOrderService} from './purchaseorder.service';
import { Store, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';

import {PurchaseOrderEffects, PurchaseOrderSlice, actionPurchaseOrderInit, reducerPurchaseOrder} from './purchaseorder.store';

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

const store = {
  purchaseOrders: reducerPurchaseOrder
}

const effects = [ PurchaseOrderEffects ]

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideStore(store), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideEffects(effects),
    PurchaseOrderService,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ Store<PurchaseOrderSlice> ],
      useFactory: (store: Store<PurchaseOrderSlice>) =>
        () => store.dispatch(actionPurchaseOrderInit())
    }
]
};
