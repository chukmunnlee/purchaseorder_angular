import { Component, OnInit, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {PurchaseOrder} from '../models';

@Component({
  selector: 'app-create-po',
  standalone: true,
  imports: [ CommonModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './create-po.component.html',
  styleUrl: './create-po.component.css'
})
export class CreatePoComponent implements OnInit {

  private fb = inject(FormBuilder)

  poForm!: FormGroup

  ngOnInit(): void {
    this.poForm = this.createForm()
  }

  process() {
    const po: PurchaseOrder = this.poForm.value
    console.info('>>> po: ', po)
  }

  private createForm(): FormGroup {
    const d = new Date()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const today = `${d.getFullYear()}-${m}-${d.getDate()}`
    return this.fb.group({
      name: this.fb.control<string>('fred', [ Validators.required, Validators.minLength(3) ]),
      address: this.fb.control<string>('1 Bedrock Ave', [ Validators.required ]),
      email: this.fb.control<string>('fred@gmail.com', [ Validators.required, Validators.email ]),
      deliveryDate: this.fb.control<string>(today, [ Validators.required, Validators.nullValidator ]),
      comments: this.fb.control<string>('')
    })
  }

}
