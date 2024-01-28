import { createAction, createReducer, createSelector, on, props} from "@ngrx/store"
import {PurchaseOrder, PurchaseOrderSummary} from "./models"
import { Injectable, inject} from "@angular/core"
import {Actions, createEffect, ofType} from "@ngrx/effects"
import {from,  map,  switchMap, tap} from "rxjs"

import {ulid} from "ulidx"

import {PurchaseOrderService} from "./purchaseorder.service"

// Store
export interface PurchaseOrderSlice {
  loadedOn: number
  purchaseOrders: PurchaseOrder[]
}

export interface PurchaseOrderStore {
  purchaseOrders: PurchaseOrderSlice
}

export interface ValueHolder<T> {
  value: T
}

// Actions
const ACTION_PO_INIT = '[PurchaseOrder] Init'
const ACTION_PO_LOAD = '[PurchaseOrder] Load'
const ACTION_PO_DELETE = '[PurchaseOrder] Delete'
const ACTION_PO_ADD = '[PurchaseOrder] Add'

export const actionPurchaseOrderInit = createAction(ACTION_PO_INIT)
export const actionPurchaseOrderLoad = createAction(ACTION_PO_LOAD, props<ValueHolder<PurchaseOrderSlice>>())
export const actionPurchaseOrderDelete = createAction(ACTION_PO_DELETE, props<ValueHolder<string>>())
export const actionPurchaseOrderAdd = createAction(ACTION_PO_ADD, props<ValueHolder<PurchaseOrder>>())

// Reducers
const INIT_VALUE: PurchaseOrderSlice = { loadedOn: 0, purchaseOrders: [] }

export const reducerPurchaseOrder = createReducer(
  INIT_VALUE,
  on(actionPurchaseOrderLoad, (_currState, action) => action.value),
  on(actionPurchaseOrderDelete, (currState, action) =>
    ({
      loadedOn: currState.loadedOn,
      purchaseOrders: currState.purchaseOrders.filter(po => po.poId !== action.value)
    })
  ),
  on(actionPurchaseOrderAdd, (currState, action) => {
    const po: PurchaseOrder = {
      ...action.value,
      poId: ulid()
    }
    return {
      loadedOn: currState.loadedOn,
      purchaseOrders: [ ...currState.purchaseOrders, po ]
    } as PurchaseOrderSlice
  })
)

// Effects

const NO_DISPATCH = { dispatch: false }
const DISPATCH = { dispatch: true }

@Injectable()
export class PurchaseOrderEffects {
  private actions$ = inject(Actions)
  private poSvc = inject(PurchaseOrderService)

  init = createEffect(
    () => this.actions$.pipe(
      ofType(actionPurchaseOrderInit),
      switchMap(() => from(this.poSvc.poTable.toArray())),
      map(purchaseOrders => (
        {
          loadedOn: (new Date()).getTime(),
          purchaseOrders
        } as PurchaseOrderSlice
      )),
      map(slice => actionPurchaseOrderLoad({ value: slice })),
      tap(data => console.info('>>> init.tap: ', data))
    ), DISPATCH
  )
}

// Selector
export const selectPurchaseOrders = (store: PurchaseOrderStore) => store.purchaseOrders.purchaseOrders
export const selectLoadedOn = (store: PurchaseOrderStore) => store.purchaseOrders.loadedOn

export const selectPurchaseOrderSummaries = createSelector(
  selectPurchaseOrders,
  pos => {
    const summaries: PurchaseOrderSummary[] = []
    for (var po of pos)
      summaries.push(
        {
          poId: po.poId,
          name: po.name,
          deliveryDate: po.deliveryDate,
          total: po.lineItems.map(li => li.quantity * li.unitPrice).reduce((acc, t) => acc + t, 0)
        } as PurchaseOrderSummary
      )
    return summaries
  }
)

export const selectPurchaseOrderById = (poId: string) =>
  createSelector(
    selectPurchaseOrders,
    pos => pos.find(po => poId === po.poId)
  )
