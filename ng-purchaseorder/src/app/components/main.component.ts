import {CommonModule} from '@angular/common';
import { Component, OnDestroy, OnInit, Signal, computed, inject, signal } from '@angular/core';
import {RouterModule} from '@angular/router';
import {Observable, Subscription, firstValueFrom, from, map, tap} from 'rxjs';
import {PurchaseOrder, PurchaseOrderSummary} from '../models';
import {PurchaseOrderStore} from '../purchaseorder.store';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit, OnDestroy {

  private poStore = inject(PurchaseOrderStore)

  purchaseOrder$!: Observable<PurchaseOrder | undefined>
  sub$!: Subscription

  // signals, set(newVal), update(oldVal => newVal)
  purchaseOrders = signal<PurchaseOrderSummary[]>([])
  purchaseOrder: Signal<PurchaseOrder | undefined> = signal(undefined)
  total: Signal<number> = computed(() => {
    var t: number = 0
    for (var po of this.purchaseOrders())
      t += po.total
    return t
  })

  ngOnInit(): void {
    this.update()
  }

  ngOnDestroy(): void {
    this.sub$.unsubscribe()
  }

  deletePurchaseOrder(poId: string) {
    console.info('>>> delete poId: ', poId)
    /*
    this.poSvc.deletePurchaseOrder(poId)
        .then(_ => this.update())
        .catch(error => alert(`Delete error\n${JSON.stringify(error)}`))
    */
  }

  showPurchaseOrder(poId: string) {
    console.info('>>> show poId: ', poId)
    this.purchaseOrder = this.poStore.selectSignal(
      slice => slice.purchaseOrders.find(po => poId === po.poId)
    )
  }

  private update() {
    this.sub$ = this.poStore.purchaseOrderSummary
      .subscribe(pos => this.purchaseOrders.set(pos))
  }

}
