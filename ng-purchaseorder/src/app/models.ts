export interface PurchaseOrder {
  poId?: string
  name: string
  address: string
  email: string
  deliveryDate: string
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
  deliveryDate: string
  total: number
}
