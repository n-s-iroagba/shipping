"use client";

import { Bank } from "@/types/bank.types";
import { 
  BanknotesIcon, 
  UserIcon, 
  HashtagIcon, 
  IdentificationIcon, 
  PencilSquareIcon, 
  TrashIcon 
} from "@heroicons/react/24/outline";

interface BankCardProps {
  bank: Bank;
  onEdit: () => void;
  onDelete: () => void;
}

export default function BankCard({ bank, onEdit, onDelete }: BankCardProps) {
  return (
    <div className="w-full ">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-4 overflow-hidden">
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-4 gap-2">
          <h3 className="text-lg font-bold text-gray-900 break-words min-w-0 flex-1">
            {bank.bankName}
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bank details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 min-w-0">
            <UserIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 break-all min-w-0 flex-1">
              {bank.accountName}
            </span>
          </div>
          
          <div className="flex items-center gap-2 min-w-0">
            <HashtagIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 break-all min-w-0 flex-1">
              {bank.accountNumber}
            </span>
          </div>
          
          <div className="flex items-center gap-2 min-w-0">
            <IdentificationIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 break-all min-w-0 flex-1">
              SWIFT: {bank.swiftCode}
            </span>
          </div>
          
          <div className="flex items-center gap-2 min-w-0">
            <BanknotesIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-sm text-gray-600 break-all min-w-0 flex-1">
              Routing: {bank.routingNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
