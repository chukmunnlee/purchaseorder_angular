import {Injectable, inject} from "@angular/core"
import {PurchaseOrder, PurchaseOrderSummary} from "./models"
import {ComponentStore, OnStoreInit} from "@ngrx/component-store"
import {PurchaseOrderService} from "./purchaseorder.service"

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
    implements OnStoreInit {

  private poSvc = inject(PurchaseOrderService)

  readonly getPurchaseOrderSummmaries = this.select(
    slice => {
      const s: PurchaseOrderSummary[] = slice.purchaseOrders.map(
        po => {
          var total = 0
          for (var p of po.lineItems)
            total += p.quantity * p.unitPrice
          return {
            poId: po.poId,
            name: po.name,
            deliveryDate: po.deliveryDate,
            total
          } as PurchaseOrderSummary
        }
      )
      return s
    }
  )

  constructor() { super(INIT_STATE) }

  ngrxOnStoreInit(): void {
    console.info('>>> ngrxOnStoreInit')
    this.poSvc.poTable.toArray()
      .then(
        purchaseOrders => this.setState({
          loadedOn: (new Date()).getTime(),
          purchaseOrders
        })
      )
  }
}
