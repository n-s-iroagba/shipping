"use client";
"use client";
import { useCallback, useState } from "react";
import { Spinner } from "@/components/Spinner";
import ErrorAlert from "@/components/ErrorAlert";
import { DocumentTextIcon, XMarkIcon } from "@heroicons/react/24/outline";
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
  } = useGetList<Payment>(routes.payment.unapproved(adminId));


 
   const [paymentToUpdate, setPaymentToUpdate] = useState<Payment | null>(null);
   const [uploadError, setUploadError] = useState<string | null>(null);
   const [isFormClosing, setIsFormClosing] = useState(false);
 
   const handleCloseForm = useCallback(async () => {
     setIsFormClosing(true);
     // Add a small delay for smooth transition
     setTimeout(() => {
       setPaymentToUpdate(null);
       setUploadError(null);
       setIsFormClosing(false);
       window.location.reload();
     }, 200);
   }, []);
 
   const handleEditPayment = useCallback((payment: Payment) => {
     setPaymentToUpdate(payment);
     setUploadError(null);
   }, []);
 
   const handleDismissError = useCallback(() => {
     setUploadError(null);
   }, []);
 
   if (loading) {
     return (
       <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
         <div className="text-center space-y-4">
           <Spinner className="w-12 h-12 text-blue-600 mx-auto" />
           <p className="text-blue-700 font-medium">Loading payments...</p>
         </div>
       </div>
     );
   }
 
   if (error) {
     return (
       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
         <div className="max-w-md w-full">
           <ErrorAlert 
             message={error || "Failed to load payments"} 
           
           />
         </div>
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
       {/* Header Section */}
       <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-blue-200">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
           <div className="max-w-6xl mx-auto">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
               <div>
                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-900 to-indigo-800 bg-clip-text text-transparent">
                   {displayName}&apos;s Payments
                 </h1>
                 <p className="text-blue-600 mt-1 text-sm sm:text-base">
                   Manage and track payment activities
                 </p>
               </div>
               
               {payments && payments.length > 0 && (
                 <div className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-full">
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                   <span className="text-blue-800 text-sm font-medium">
                     {payments.length} payment{payments.length !== 1 ? 's' : ''}
                   </span>
                 </div>
               )}
             </div>
           </div>
         </div>
       </div>
 
       {/* Main Content */}
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
         <div className="max-w-6xl mx-auto">
           {/* Error Alert */}
           {uploadError && (
             <div className="mb-6 relative">
               <ErrorAlert 
                 message={uploadError} 
                
               />
               <button
                 onClick={handleDismissError}
                 className="absolute right-3 top-3 p-1 hover:bg-red-100 rounded-full transition-colors"
                 aria-label="Dismiss error"
               >
                 <XMarkIcon className="w-5 h-5 text-red-500" />
               </button>
             </div>
           )}
 
           {/* Payment Form Modal */}
           {paymentToUpdate && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-200 ${
                 isFormClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
               }`}>
                 <AdminPaymentForm
                   payment={paymentToUpdate}
                   onClose={handleCloseForm}
                 />
               </div>
             </div>
           )}
 
           {/* Empty State */}
           {!payments || payments.length === 0 ? (
             <div className="flex items-center justify-center min-h-[60vh]">
               <div className="text-center max-w-md">
                 <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-100">
                   <div className="flex justify-center mb-6">
                     <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full">
                       <DocumentTextIcon className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600" />
                     </div>
                   </div>
                   <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-3">
                     No Payments Yet
                   </h3>
                   <p className="text-blue-700 leading-relaxed">
                     Payments will appear here once clients respond to billing requests. 
                     Check back soon!
                   </p>
                   <div className="mt-6 flex justify-center">
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                       <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           ) : (
             /* Payments Grid */
             <div className="space-y-4 sm:space-y-6">
               <div className="grid gap-4 sm:gap-6">
                 {payments.map((payment, index) => (
                   <div
                     key={payment.id}
                     className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                     style={{
                       animationDelay: `${index * 100}ms`,
                       animation: 'fadeInUp 0.5s ease-out forwards'
                     }}
                   >
                     <AdminPaymentCard
                       payment={payment}
                       onEdit={() => handleEditPayment(payment)}
                     />
                   </div>
                 ))}
               </div>
             </div>
           )}
         </div>
       </div>
 
       {/* Custom Styles */}
       <style jsx>{`
         @keyframes fadeInUp {
           from {
             opacity: 0;
             transform: translateY(20px);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
       `}</style>
     </div>
   );
 }