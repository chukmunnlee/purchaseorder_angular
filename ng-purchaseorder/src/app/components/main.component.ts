import {CommonModule} from '@angular/common';
import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import {RouterModule} from '@angular/router';
import {PurchaseOrderService} from '../purchaseorder.service';
import {PurchaseOrder, PurchaseOrderSummary} from '../models';
import {Store} from '@ngrx/store';
import {PurchaseOrderSlice, actionPurchaseOrderDelete, selectPurchaseOrderById, selectPurchaseOrderSummaries} from '../purchaseorder.store';
import {Observable, tap} from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  private poSvc = inject(PurchaseOrderService)
  private store = inject(Store<PurchaseOrderSlice>)

  purchaseOrder$!: Observable<PurchaseOrder | undefined>
  purchaseOrders$!: Observable<PurchaseOrderSummary[]>

  total = 0

  // signals, set(newVal), update(oldVal => newVal)
  purchaseOrders = signal<PurchaseOrderSummary[]>([])
  purchaseOrder = signal<PurchaseOrder | undefined>(undefined)

  ngOnInit(): void {
    this.update()
  }

  deletePurchaseOrder(poId: string) {
    console.info('>>> delete poId: ', poId)
    this.store.dispatch(actionPurchaseOrderDelete({ value: poId }))
  }

  showPurchaseOrder(poId: string) {
    console.info('>>> show poId: ', poId)
    this.purchaseOrder$ = this.store.select(selectPurchaseOrderById(poId))
  }

  private update() {
    this.purchaseOrders$ = this.store.select(selectPurchaseOrderSummaries)
        .pipe(
          tap(pos => {
            this.total = pos.reduce((acc, po) => acc + po.total, 0)
          })
        )
  }

}
