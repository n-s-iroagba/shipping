"use client";
"use client";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useGetList } from "@/hooks/useGet";
import { routes } from "@/data/routes";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Payment } from "@/types/payment.types";
import AdminPaymentCard from "@/components/AdminPaymentCard";
import AdminPaymentForm from "@/components/AdminPaymentForm";

export default function PendingPaymentPage() {
  const { adminId, displayName } = useAuthContext();
  const {
    data: payments,
    loading,
    error,
  } = useGetList<Payment>(routes.payment.list(adminId));

  const [paymentToUpdate, setpaymentToUpdate] =
    useState<Payment | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <ErrorAlert message={error || "Failed to load document payments"} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
            {displayName}&apos;s Payments
          </h1>
      

        {uploadError && (
          <div className="mb-6">
            <ErrorAlert message={uploadError} />
          </div>
        )}

   

        {paymentToUpdate && (
          <AdminPaymentForm
            payment={paymentToUpdate}
            
            onClose={() => {
              setpaymentToUpdate(null);
              setUploadError(null);
              window.location.reload();
            }}
          />
        )}

        {!payments || payments.length === 0 ? (
          <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <DocumentTextIcon className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              No Payments Yet
            </h3>
            <p className="text-blue-700">
              Payments will appear here once a client responds to billing
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <AdminPaymentCard
                key={payment.id}
                payment={payment}
                onEdit={() => {
                  setpaymentToUpdate(payment);
                  setUploadError(null);
                }}
               
              />
            ))}
          </div>
        )}

   
      </div>
        </div>
    </div>
  );
}
