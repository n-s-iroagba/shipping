"use client";
import AdminStageList from "@/components/AdminStageList";
import { routes } from "@/data/routes";
import { useGetList } from "@/hooks/useGet";
import { Stage } from "@/types/stage.types";
import { motion } from "framer-motion";
import { useParams,useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";

const ShipmentStageList = () => {
  const { id } = useParams();
  const router = useRouter()
  const route = id ? routes.stage.getAll(id as string) : "";
  const { data } = useGetList<Stage>(route);

  return (
    <>
      {" "}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Shipping Stages
          </h1>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/admin/shipment/${id}/stages/new`)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium shadow-md"
        >
          <FiPlus className="text-lg" />
          Create New Stages
        </motion.button>
      </motion.div>
      <AdminStageList stages={data} />;
    </>
  );
};
export default ShipmentStageList;
