import React from "react";
import { Pagination } from "@nextui-org/react";

export default function PaginationComponent({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="mt-4">
      <Pagination
        loop
        showControls
        total={totalPages}
        initialPage={currentPage}
        onChange={(page) => onPageChange(page)}
        classNames={{
          cursor:"custom-cursor-item",
          item: "custom-pagination-item",
          active: "custom-active-item", 
        }}
      />
    </div>
  );
}
