import {CommonModule} from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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

  purchaseOrders$!: Observable<PurchaseOrderSummary[]>
  purchaseOrder$!: Promise<PurchaseOrder | undefined>

  ngOnInit(): void {
    this.update()
  }

  deletePurchaseOrder(poId: string) {
    console.info('>>> delete poId: ', poId)
    this.poSvc.deletePurchaseOrder(poId)
        .then(count => this.update())
        .catch(error => alert(`Delete error\n${JSON.stringify(error)}`))
  }

  showPurchaseOrder(poId: string) {
    console.info('>>> show poId: ', poId)
    this.purchaseOrder$ = this.poSvc.findPurchaseOrderById(poId)
  }

  private update() {
    this.purchaseOrders$ = from(this.poSvc.getPurchaseOrderSummary())
      .pipe(
        map(pos => {
          //@ts-ignore
          pos.sort((p0, p1) => {
            if (p0.deliveryDate < p1.deliveryDate)
              return -1
            else if (p0.deliveryDate > p1.deliveryDate)
              return 1
            else 0
          })
          return pos
        }),
        tap(data => console.info('data: ', data))
      )
  }

}
