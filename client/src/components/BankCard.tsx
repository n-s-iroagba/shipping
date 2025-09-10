"use client"

import { Bank } from "@/types/bank.types"
import { BanknotesIcon, UserIcon, HashtagIcon, IdentificationIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"

interface BankCardProps {
  bank: Bank
  onEdit: () => void
  onDelete: () => void
}

export default function BankCard({ bank, onEdit, onDelete }: BankCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{bank.bankName}</h3>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
          <UserIcon className="w-4 h-4" /> {bank.accountName}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
          <HashtagIcon className="w-4 h-4" /> {bank.accountNumber}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
          <IdentificationIcon className="w-4 h-4" /> SWIFT: {bank.swiftCode}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
          <BanknotesIcon className="w-4 h-4" /> Routing: {bank.routingNumber}
        </p>
      </div>
           <div className="flex gap-4 mt-6 justify-end">
            <button
              onClick={onEdit}
              className="p-2 text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <PencilSquareIcon className="w-5 h-5" />
              <span className="hidden md:inline">Edit</span>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
            >
              <TrashIcon className="w-5 h-5" />
              <span className="hidden md:inline">Delete</span>
            </button>
          </div>
    </div>
  )
}