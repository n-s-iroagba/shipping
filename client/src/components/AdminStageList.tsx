"use client";

import React, { useState } from "react";
import AdminStageCard from "./AdminStageCard"; // assumed to be your custom component
import { Stage } from "@/types/stage.types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface AdminStageListProps {
  stages: Stage[];
}

const ITEMS_PER_PAGE = 6;

const AdminStageList: React.FC<AdminStageListProps> = ({ stages }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [stageToBeDeleted, setStageToBeDeleted] = useState<Stage | null>(null);

  const totalPages = Math.ceil(stages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems =
    stages || [].slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentItems.length &&
          currentItems.map((stage) => (
            <AdminStageCard
              stage={stage}
              onDelete={(stage) => setStageToBeDeleted(stage)}
              key={stage.id}
            />
          ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      {stageToBeDeleted && (
        <DeleteConfirmationModal
          id={stageToBeDeleted.id}
          onClose={() => setStageToBeDeleted(null)}
          type={"stage"}
          message={"Confirm stage to be deleted"}
        />
      )}
    </div>
  );
};

export default AdminStageList;
