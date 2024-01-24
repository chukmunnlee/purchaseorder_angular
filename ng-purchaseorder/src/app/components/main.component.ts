import {CommonModule} from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {RouterModule} from '@angular/router';
import {PurchaseOrderService} from '../purchaseorder.service';
import {Observable, from} from 'rxjs';
import {PurchaseOrderSummary} from '../models';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  providers: [ PurchaseOrderService ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  private poSvc = inject(PurchaseOrderService)

  purchaseOrders$!: Observable<PurchaseOrderSummary[]>

  ngOnInit(): void {
    this.purchaseOrders$ = from(this.poSvc.getPurchaseOrderSummary())
  }

}
