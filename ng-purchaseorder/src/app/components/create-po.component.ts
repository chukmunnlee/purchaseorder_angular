import { Component, OnInit, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';

import {PurchaseOrder} from '../models';
import {CanLeaveRoute} from '../app.config';
import {PurchaseOrderStore} from '../purchaseorder.store';

@Component({
  selector: 'app-create-po',
  standalone: true,
  imports: [ CommonModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './create-po.component.html',
  styleUrl: './create-po.component.css'
})
export class CreatePoComponent implements OnInit, CanLeaveRoute {

  private fb = inject(FormBuilder)
  private poStore = inject(PurchaseOrderStore)
  private router = inject(Router)

  poForm!: FormGroup
  liArray!: FormArray

  ngOnInit(): void {
    this.poForm = this.createForm()
  }

  canLeave(): boolean {
    return !this.poForm.dirty
  }

  message():  string {
    return `
      The purchase order has not been save.
      Are you sure you want to leave?
    `
  }

  process() {
    const po: PurchaseOrder = this.poForm.value
    po.deliveryDate = new Date(this.poForm.value['deliveryDate']).getTime()
    this.poStore.addPurchaseOrder(po)
    this.poForm = this.createForm()
    this.router.navigate(['/'])
  }

  addLineItem() {
    this.liArray.push(this.createLineItem())
  }
  removeLineItem(idx: number) {
    this.liArray.removeAt(idx)
  }

  invalid(): boolean {
    return this.poForm.invalid || this.liArray.length <= 0
  }

  private createLineItem(): FormGroup {
    return this.fb.group({
      item: this.fb.control<string>('', [ Validators.required, Validators.minLength(3)]),
      quantity: this.fb.control<number>(1, [ Validators.required, Validators.min(1) ]),
      unitPrice: this.fb.control<number>(1, [ Validators.required, Validators.min(0.1) ]),
    })
  }

  private createForm(): FormGroup {
    const d = new Date()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const today = `${d.getFullYear()}-${m}-${d.getDate()}`
    this.liArray = this.fb.array([])
    return this.fb.group({
      name: this.fb.control<string>('fred', [ Validators.required, Validators.minLength(3) ]),
      address: this.fb.control<string>('1 Bedrock Ave', [ Validators.required ]),
      email: this.fb.control<string>('fred@gmail.com', [ Validators.required, Validators.email ]),
      deliveryDate: this.fb.control<string>(today, [ Validators.required, Validators.nullValidator ]),
      comments: this.fb.control<string>(''),
      lineItems: this.liArray
    })
  }

}
