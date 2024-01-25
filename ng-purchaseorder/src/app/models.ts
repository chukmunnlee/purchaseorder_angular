export interface PurchaseOrder {
  poId?: string
  name: string
  address: string
  email: string
  deliveryDate: number
  comments: string
  lineItems: LineItem[]
}

export interface LineItem {
  item: string
  quantity: number
  unitPrice: number
}

export interface PurchaseOrderSummary {
  poId: string
  name: string
  deliveryDate: number
  total: number
}
