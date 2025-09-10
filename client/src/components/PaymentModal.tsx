import { useState } from "react";
import type { CryptoWallet } from "@/types/crypto-wallet.types";
import { Bank } from "@/types/bank.types";
import { XMarkIcon, DocumentDuplicateIcon, CloudArrowUpIcon, TrashIcon } from "@heroicons/react/24/outline";

interface PaymentModalProps {
  statusId: string;
  onClose: () => void;
  feeInDollars: number;
  cryptoWallets: CryptoWallet[];
  bank: Bank|null;
}

export default function PaymentModal({
  onClose,
  feeInDollars,
  cryptoWallets,
  bank
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "fiat" | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<CryptoWallet | null>(null);
  const [uploadedReceipts, setUploadedReceipts] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = async () => {
    if (!selectedWallet) return;
    try {
      await navigator.clipboard.writeText(selectedWallet.walletAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      setUploadError("Failed to copy address");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        setUploadError("Only JPG, PNG, and PDF files are allowed");
        return false;
      }
      if (!isValidSize) {
        setUploadError("File size must be less than 5MB");
        return false;
      }
      return true;
    });

    setUploadedReceipts((prev) => [...prev, ...validFiles]);
    setUploadError(null);
  };

  const removeReceipt = (index: number) => {
    setUploadedReceipts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadReceipts = async () => {
    if (uploadedReceipts.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onClose();
      window.location.reload();
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload receipts"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCryptoAmount = (wallet: CryptoWallet) => {
    // This is a simplified conversion - in real app, you'd use current exchange rates
    const rates: { [key: string]: number } = {
      'btc': 50000,
      'eth': 3000,
      'usdt': 1,
      'usdc': 1
    };
    const rate = rates[wallet.currency.toLowerCase()] || 1;
    return (feeInDollars / rate).toFixed(8);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Make Payment</h3>
            <button
              onClick={onClose}
              className="text-white hover:text-sky-200 transition-colors"
              disabled={isUploading}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <p className="text-sky-100 mt-2">Total Amount: {formatPrice(feeInDollars, 'USD')}</p>
        </div>

        <div className="p-6">
          {/* Payment Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("crypto")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === "crypto" 
                    ? "border-sky-500 bg-sky-50 text-sky-700" 
                    : "border-gray-200 bg-white text-gray-600 hover:border-sky-300"
                }`}
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-bold">₿</span>
                  </div>
                  <span className="font-medium">Cryptocurrency</span>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("fiat")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  paymentMethod === "fiat" 
                    ? "border-sky-500 bg-sky-50 text-sky-700" 
                    : "border-gray-200 bg-white text-gray-600 hover:border-sky-300"
                }`}
              >
                <div className="text-center">
                  <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-sm font-bold">$</span>
                  </div>
                  <span className="font-medium">Bank Transfer</span>
                </div>
              </button>
            </div>
          </div>

          {/* Crypto Payment Section */}
          {paymentMethod === "crypto" && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Cryptocurrency
              </label>
              <select
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-colors"
                onChange={(e) => {
                  const wallet = cryptoWallets.find(
                    (w) => w.id === Number(e.target.value)
                  );
                  setSelectedWallet(wallet || null);
                }}
                value={selectedWallet?.id || ""}
              >
                <option value="">Choose a cryptocurrency</option>
                {cryptoWallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.currency.toUpperCase()} - {wallet.currency}
                  </option>
                ))}
              </select>

              {selectedWallet && (
                <div className="mt-4 bg-sky-50 border border-sky-200 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Wallet Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Currency:</span> {selectedWallet.currency.toUpperCase()}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Type:</span> {selectedWallet.currency}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Amount to send:</span>{" "}
                          {getCryptoAmount(selectedWallet)} {selectedWallet.currency.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wallet Address
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={selectedWallet.walletAddress}
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-mono bg-gray-50"
                        />
                        <button
                          onClick={handleCopyAddress}
                          className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600 transition-colors"
                          title="Copy address"
                        >
                          <DocumentDuplicateIcon className="h-5 w-5" />
                        </button>
                      </div>
                      {copiedAddress && (
                        <p className="text-green-600 text-sm mt-2">✓ Address copied!</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Important:</strong> Send exactly {getCryptoAmount(selectedWallet)} {selectedWallet.currency.toUpperCase()} 
                      ({formatPrice(feeInDollars, 'USD')}) to this address. Your booking will be confirmed after payment verification.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bank Transfer Section */}
          {paymentMethod === "fiat" && bank && (
            <div className="mb-6">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-700 mb-4 text-center">
                  Bank Transfer Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Bank Name:</span>
                      <p className="text-gray-800 font-semibold">{bank.bankName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Account Name:</span>
                      <p className="text-gray-800 font-semibold">{bank.accountName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Account Number:</span>
                      <p className="text-gray-800 font-semibold font-mono">{bank.accountNumber}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-600">SWIFT Code:</span>
                      <p className="text-gray-800 font-semibold font-mono">{bank.swiftCode}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Routing Number:</span>
                      <p className="text-gray-800 font-semibold font-mono">{bank.routingNumber}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Amount:</span>
                      <p className="text-sky-600 font-bold text-lg">{formatPrice(feeInDollars, 'USD')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Include your name and order reference in the transfer description. 
                    Payment processing may take 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Receipt Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Payment Receipt {paymentMethod && "(Required)"}
            </label>
            
            {uploadError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {uploadError}
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
              <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Drag & drop files here or click to browse</p>
              <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, PDF (Max 5MB each)</p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="receipt-upload"
                className="inline-block bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                Choose Files
              </label>
            </div>

            {uploadedReceipts.length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="font-medium text-gray-700">Selected files:</h5>
                {uploadedReceipts.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
                  >
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <span className="text-xs text-gray-500 mr-2">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                    <button
                      onClick={() => removeReceipt(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={isUploading}
                      title="Remove file"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isUploading}
            >
              Cancel
            </button>
            
            {uploadedReceipts.length > 0 && (
              <button
                onClick={handleUploadReceipts}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="h-4 w-4" />
                    Upload Receipts ({uploadedReceipts.length})
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}