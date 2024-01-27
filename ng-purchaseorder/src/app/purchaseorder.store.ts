import {Injectable, OnDestroy, inject} from "@angular/core";
import {PurchaseOrder, PurchaseOrderSummary} from "./models";
import {ComponentStore, OnStateInit, OnStoreInit} from "@ngrx/component-store";
import {Observable} from "rxjs";
import { ulid } from 'ulidx'

import {PurchaseOrderService} from "./purchaseorder.service";

export interface PurchaseOrderSlice {
  loadedOn: number
  purchaseOrders: PurchaseOrder[]
}

const INIT_STATE: PurchaseOrderSlice = {
  loadedOn: 0,
  purchaseOrders: []
}

@Injectable()
export class PurchaseOrderStore extends ComponentStore<PurchaseOrderSlice>
      implements OnStoreInit, OnStateInit, OnDestroy {

  private poSvc = inject(PurchaseOrderService)

  readonly purchaseOrderSummary: Observable<PurchaseOrderSummary[]> =
        this.select(slice => slice.purchaseOrders.map(
          po => {
            var total = 0
            for (let i of po.lineItems)
              total += i.quantity * i.unitPrice
            const summary: PurchaseOrderSummary = {
              // @ts-ignore
              poId: po.poId,
              name: po.name,
              deliveryDate: po.deliveryDate,
              total
            }
            return summary
          }
        ))

  readonly addPurchaseOrder  = this.updater(
      (slice: PurchaseOrderSlice, value: PurchaseOrder) => {
        value.poId = ulid()
        return {
          loadedOn: slice.loadedOn,
          purchaseOrders: [ ...slice.purchaseOrders, value ]
        } as PurchaseOrderSlice
      }
  )

  readonly findPurchaseOrderById = (poId: string): Observable<PurchaseOrder | undefined> =>
      this.select(slice => slice.purchaseOrders.find(po => poId === po.poId))

  //readonly deletePurchaseOrder = (poId: string) => this.updater(

  //)

  constructor() {
    super(INIT_STATE)
  }

  ngrxOnStoreInit(): void {
    console.info('>>> on STORE init')
    this.poSvc.poTable.toArray()
      .then(purchaseOrders => {
        this.setState({ loadedOn: (new Date()).getTime(), purchaseOrders })
      })
      .catch(err => {
        alert(`Error: Cannot load purchase orders\n${JSON.stringify(err)}`)
      })
  }

  ngrxOnStateInit(): void {
    console.info('>>> on STATE init')
  }

  override ngOnDestroy(): void {
    console.info('>>>> in component ngOnDestroy')
    super.ngOnDestroy()
  }
}
