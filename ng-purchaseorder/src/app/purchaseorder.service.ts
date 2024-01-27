import {Injectable} from "@angular/core";
import Dexie, {Table} from "dexie";
import {LineItem, PurchaseOrder, PurchaseOrderSummary} from "./models";
import {ulid} from "ulidx";

@Injectable()
export class PurchaseOrderService extends Dexie {

  poTable!: Table<PurchaseOrder, string>

  constructor() {
    super("acme")
    this.version(1).stores({
      purchaseOrder: 'poId, deliveryDate'
    })
    this.poTable = this.table('purchaseOrder')
  }

  newPurchaseOrder(po: PurchaseOrder): Promise<string> {
    po.poId = ulid()
    return this.poTable.add(po)
  }

  getPurchaseOrderSummary(): Promise<PurchaseOrderSummary[]> {
    return this.poTable
      .orderBy('deliveryDate')
      .reverse()
      .toArray()
      .then(pos => pos.map(po => {
        let total = 0;
        for (let l of po.lineItems)
          total += l.unitPrice * l.quantity
        return {
          poId: po.poId,
          name: po.name,
          deliveryDate: po.deliveryDate,
          total
        } as PurchaseOrderSummary
      }))
  }

  findPurchaseOrderById(poId: string): Promise<PurchaseOrder | undefined> {
      return this.poTable.filter(po => po.poId == poId)
        .toArray()
        .then(pos => !!pos.length? pos[0]: undefined)
  }

  deletePurchaseOrder(poId: string): Promise<number> {
    return this.poTable.where("poId").equals(poId)
        .delete()
  }
}
