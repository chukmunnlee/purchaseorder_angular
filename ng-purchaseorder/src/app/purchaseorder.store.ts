import {Injectable, OnDestroy, inject} from "@angular/core";
import {LineItem, PurchaseOrder, PurchaseOrderSummary} from "./models";
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

const totalPrice = (lineItems: LineItem[]) => lineItems
    .map(li => li.quantity * li.unitPrice)
    .reduce((acc, t) => acc + t, 0)

export const getPurchaseOrderSummary = (slice: PurchaseOrderSlice) => {
  const summary: PurchaseOrderSummary[] = []
  for (var po of slice.purchaseOrders) {
      summary.push({
        // @ts-ignore
        poId: po.poId,
        name: po.name,
        deliveryDate: po.deliveryDate,
        total: totalPrice(po.lineItems)
      } as PurchaseOrderSummary)
  }
  return summary
}

@Injectable()
export class PurchaseOrderStore extends ComponentStore<PurchaseOrderSlice>
      implements OnStoreInit, OnStateInit, OnDestroy {

  private poSvc = inject(PurchaseOrderService)

  readonly purchaseOrderSummary: Observable<PurchaseOrderSummary[]> =
        this.select(slice => slice.purchaseOrders.map(
          po => {
            const summary: PurchaseOrderSummary = {
              // @ts-ignore
              poId: po.poId,
              name: po.name,
              deliveryDate: po.deliveryDate,
              total: totalPrice(po.lineItems)
            }
            return summary
          }
        ))

  readonly addPurchaseOrder = this.updater(
      (slice: PurchaseOrderSlice, value: PurchaseOrder) => {
        value.poId = ulid()
        return {
          loadedOn: slice.loadedOn,
          purchaseOrders: [ ...slice.purchaseOrders, value ]
        } as PurchaseOrderSlice
      }
  )

  readonly deletePurchaseOrder = (poId: string) =>
      this.updater<void>(
        (slice: PurchaseOrderSlice) => {
          return {
            loadedOn: slice.loadedOn,
            purchaseOrders: slice.purchaseOrders.filter(po => poId !== po.poId)
          } as PurchaseOrderSlice
        }
      )()

  readonly findPurchaseOrderById = (poId: string): Observable<PurchaseOrder | undefined> =>
      this.select(slice => slice.purchaseOrders.find(po => poId === po.poId))

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
