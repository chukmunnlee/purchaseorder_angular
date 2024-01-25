import {CommonModule} from '@angular/common';
import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import {RouterModule} from '@angular/router';
import {PurchaseOrderService} from '../purchaseorder.service';
import {Observable, from, map, tap} from 'rxjs';
import {PurchaseOrder, PurchaseOrderSummary} from '../models';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  private poSvc = inject(PurchaseOrderService)

  purchaseOrder$!: Promise<PurchaseOrder | undefined>

  // signals, set(newVal), update(oldVal => newVal)
  purchaseOrders = signal<PurchaseOrderSummary[]>([])
  purchaseOrder = signal<PurchaseOrder | undefined>(undefined)
  total: Signal<number> = computed(() => {
    var t: number = 0
    for (var po of this.purchaseOrders())
      t += po.total
    return t
  })

  ngOnInit(): void {
    this.update()
  }

  deletePurchaseOrder(poId: string) {
    console.info('>>> delete poId: ', poId)
    this.poSvc.deletePurchaseOrder(poId)
        .then(_ => this.update())
        .catch(error => alert(`Delete error\n${JSON.stringify(error)}`))
  }

  showPurchaseOrder(poId: string) {
    console.info('>>> show poId: ', poId)
    this.poSvc.findPurchaseOrderById(poId)
      .then(po => this.purchaseOrder.set(po))
  }

  private update() {
    this.poSvc.getPurchaseOrderSummary()
      .then(pos => {
        //@ts-ignore
        pos.sort((p0, p1) => {
          if (p0.deliveryDate < p1.deliveryDate)
            return -1
          else if (p0.deliveryDate > p1.deliveryDate)
            return 1
          else 0
        })
        this.purchaseOrders.set(pos)
      })
  }

}
