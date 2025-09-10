"use client"

import { useState } from "react"

import BankForm from "@/components/BankForm"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"

import { Spinner } from "@/components/Spinner"
import { PlusIcon } from "@heroicons/react/24/outline"

import ErrorAlert from "@/components/ErrorAlert"
import { useGetSingle } from "@/hooks/useGet"
import { Bank } from "@/types/bank.types"
import BankCard from "@/components/BankCard"
import { useAuthContext } from "@/hooks/useAuthContext"

export default function BanksPage() {
  const {adminId}= useAuthContext()
  const { data: bank, loading, error } = useGetSingle<Bank>(`/bank/${adminId}`)
  const [bankToDelete, setBankToDelete] = useState<Bank | null>(null)
  const [bankToUpdate, setBankToUpdate] = useState<Bank | null>(null)
  const [createBank, setCreateBank] = useState(false)

  if (loading) {
    return (   <div className="flex justify-center items-center h-64">
          <Spinner className="w-10 h-10 text-slate-600" />
        </div>

    )
  }

  if (error) {
    return (
     
        <ErrorAlert message={error || "Failed to load banks"} />

    )
  }

  return (
   
      <div className="bg-slate-50 min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6 mb-6 relative">
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-slate-800 opacity-20" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-slate-800 opacity-20" />

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">Bank</h1>
             {!bank && <button
                onClick={() => setCreateBank(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Add Bank</span>
              </button>
}
            </div>
          </div>

          {/* Forms */}
          <div className="space-y-6 mb-8">
            {createBank && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 overflow-hidden">
                <BankForm adminId={adminId} onClose={() => setCreateBank(false)} />
              </div>
            )}

            {bankToUpdate && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 overflow-hidden">
                <BankForm  adminId={adminId} existingBank={bankToUpdate} onClose={() => setBankToUpdate(null)} />
              </div>
            )}
          </div>



              {bank ? (
                <div
                  className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <BankCard
                    bank={bank}
                    onEdit={() => setBankToUpdate(bank)}
                    onDelete={() => setBankToDelete(bank)}
                  />
                </div>
           
          
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-8 h-8 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No Banks</h3>
                <p className="text-slate-600 mb-4">Add your first bank to receive payments</p>
             
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {bankToDelete && (
            <DeleteConfirmationModal
              onClose={() => setBankToDelete(null)}
              id={bankToDelete.accountNumber}
              message={`${bankToDelete.bankName} bank`}
              type="bank"
            />
          )}
        </div>
      </div>
  
  )
}
