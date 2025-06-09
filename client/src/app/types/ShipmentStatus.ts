export interface ShippingStatus {
  id: string
  shipmentDetailsId: number
  title: string
  location: string
  carrierNote: string
  dateAndTime: Date
  percentageNote?: number|null
  feeInDollars?: number | null
  paymentStatus: 'NO_PAYMENT_REQUIRED'|"UNPAID" | "PENDING" | "PAID"
  amountPaid?: number
  paymentDate?: Date
  supportingDocument?: Buffer
  paymentReceipt?:  Buffer
  longitude: number
  latitude: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateShippingStatus {
  title: string
  location: string
  carrierNote: string
  dateAndTime: Date
  percentageNote?: number|null
  feeInDollars?: number | null
  paymentStatus: 'NO_PAYMENT_REQUIRED'|"UNPAID" | "PENDING" | "PAID"
  longitude: number
  latitude: number

}