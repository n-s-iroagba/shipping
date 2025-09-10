"use client";
import { routes } from "@/data/routes";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useGetList } from "@/hooks/useGet";

// import { Stage } from "@/types/stage.types";
// import TodoAlert from "@/components/TodoAlert";
import { ReactNode } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/Spinner";
import { motion } from "framer-motion";
import { FiTruck, FiUser, FiMapPin, FiPackage } from "react-icons/fi";
import { Shipment } from "@/types/shipment.types";
import { CryptoWallet } from "@/types/crypto-wallet.types";
import { Stage } from "@/types/stage.types";
import ErrorAlert from "@/components/ErrorAlert";
import TodoAlert from "@/components/TodoAlert";


const Todo = () => {
  const { loading: authLoading, displayName, adminId } = useAuthContext();

  const {
    error,
    loading,
    data: shipments,
  } = useGetList<Shipment>(routes.shipment.list(adminId));

  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useGetList<CryptoWallet>(routes.cryptoWallet.list(adminId));

  const {
    data: payments,
    error: paymentError,
    loading: paymentLoading,
  } = useGetList<Stage>(routes.payment.unapproved(adminId));

  const todos: ReactNode[] = [];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };
  if (!wallets.length) {
    todos.push(
      <TodoAlert
        key="wallet-alert"
        message="You do not have any wallets, add wallets to start managing transactions"
        link="/admin/crypto-wallets"
      />,
    );
  }

  if (payments.length) {
    todos.push(
      <TodoAlert
        key="Pending-payment"
        message="You have pending payments"
        link="/admin/pending-payments"
      />,
    );
  }

  if (
    authLoading ||
     walletLoading || paymentLoading
    ||loading
  ) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <Spinner className="w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if( walletError || paymentError||error
  ){
    return (
    <ErrorAlert message={paymentError || walletError || "Not Authorised"} />
  );
  }

  return (
    <>
      {/* Mobile-optimized content container */}
      <div className="w-full">
        {/* Header - Responsive text sizing */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
            <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <span className="break-words">Welcome back, {displayName}!</span>
          </h2>
          <h3 className="text-base sm:text-lg font-semibold text-blue-700">
            Admin Tasks
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {todos.length > 0 ? (
            <div className="grid gap-3 sm:gap-4">
              {todos.map((todo, index) => (
                <div key={index} className="w-full">
                  {todo}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 text-center">
              <p className="text-blue-700 font-medium text-sm sm:text-base">
                🎉 All caught up! No pending tasks
              </p>
            </div>
          )}
        </div>
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <FiTruck className="text-2xl" />
              </div>
              <div>
                <p className="text-gray-500">Total Shipments</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {shipments.length}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-500"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiUser className="text-2xl" />
              </div>
              <div>
                <p className="text-gray-500">Active Senders</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {new Set(shipments.map((s) => s.senderName)).size}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-green-500"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FiMapPin className="text-2xl" />
              </div>
              <div>
                <p className="text-gray-500">Unique Destinations</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {new Set(shipments.map((s) => s.destination)).size}
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-purple-500"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiPackage className="text-2xl" />
              </div>
              <div>
                <p className="text-gray-500">Recent Activity</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {shipments.length > 0 ? "Active" : "None"}
                </h3>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Todo;
