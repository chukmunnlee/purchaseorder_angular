import {CommonModule} from '@angular/common';
import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import {RouterModule} from '@angular/router';
import {PurchaseOrderService} from '../purchaseorder.service';
import {Observable, from, map, of, single, tap} from 'rxjs';
import {PurchaseOrder, PurchaseOrderSummary} from '../models';
import {PurchaseOrderStore} from '../purchaseorder.store';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  private poSvc = inject(PurchaseOrderService)
  private poStore = inject(PurchaseOrderStore)

  purchaseOrder$!: Promise<PurchaseOrder | undefined>

  // signals, set(newVal), update(oldVal => newVal)
  purchaseOrders = signal<PurchaseOrderSummary[]>([])
  purchaseOrder = signal<PurchaseOrder | undefined>(undefined)

  purchaseOrderSummaries$!: Observable<PurchaseOrderSummary[]>
  total$!: Observable<number>

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
    this.purchaseOrderSummaries$ = this.poStore.getPurchaseOrderSummmaries
        .pipe(
          tap(pos => {
            this.total$ = of(
              pos.map(p => p.total)
                .reduce((acc, v) => acc + v, 0)
            )
          })
        )
  }

}
