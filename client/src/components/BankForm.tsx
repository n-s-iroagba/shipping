"use client"

import type React from "react"
import { useState } from "react"

import { BanknotesIcon } from "@heroicons/react/24/outline"

import toast from "react-hot-toast"
import { Bank } from "@/types/bank.types"
import { SERVER_URL } from "@/utils/apiUtils"

interface BankFormProps {
  patch?: boolean
  adminId:string|number
  existingBank?: Bank
  onClose: () => void
}

export default function BankForm({ patch, existingBank, onClose,adminId }: BankFormProps) {
  const [bankData, setBankData] = useState<Partial<Bank>>(
    existingBank || {
      bankName: "",
      accountName: "",
      accountNumber: "",
      swiftCode: "",
      routingNumber: "",
    }
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBankData((prev) => ({ ...prev, [name]: value }))
  }

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
  
 
     setIsSubmitting(true)

     const url = existingBank ? `/bank/${existingBank.id}` : `/bank/${adminId}`

     const method = existingBank ? "PUT" : "POST"

     try {
       const response = await fetch(`${SERVER_URL}${url}`, {
         method,
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify(bankData),
       })
 
       if (!response.ok) {
         const errorData = await response.json()
         throw new Error(errorData.message || "Failed to submit form")
       }

       toast.success(existingBank ? "Bank updated successfully!" : "Bank created successfully!")

       if (!existingBank) {
         setBankData({
           bankName: "",
           accountName: "",
           accountNumber: "",
           swiftCode: "",
           routingNumber: "",
         })
       }
       onClose()
     } catch (error) {
       console.error("Submission error:", error)
       toast.error("An error occurred. Please try again.")
     } finally {
 
       setIsSubmitting(false)
       window.location.reload()
     }
   }
 
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-50 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <BanknotesIcon className="w-6 h-6 text-slate-700" />
        {patch ? "Edit Bank" : "Add New Bank"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="bankName"
          value={bankData.bankName}
          onChange={handleChange}
          placeholder="Bank Name"
          className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-slate-500 text-black"
        />
        <input
          type="text"
          name="accountName"
          value={bankData.accountName}
          onChange={handleChange}
          placeholder="Account Name"
          className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-slate-500 text-black"
        />
        <input
          type="text"
          name="accountNumber"
          value={bankData.accountNumber}
          onChange={handleChange}
          placeholder="Account Number"
          className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-slate-500 text-black"
        />
        <input
          type="text"
          name="swiftCode"
          value={bankData.swiftCode}
          onChange={handleChange}
          placeholder="SWIFT Code"
          className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-slate-500 text-black"
        />
        <input
          type="text"
          name="routingNumber"
          value={bankData.routingNumber}
          onChange={handleChange}
          placeholder="Routing Number"
          className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-slate-500 text-black"
        />

        <button className="px-8 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 w-full">
         {isSubmitting ?  (
              <>
                <span className="animate-spin">🌀</span>
                Processing...
              </>
            ) : patch ? "Update Bank" : "Add Bank"}
        </button>
      </form>
    </div>
  )
}