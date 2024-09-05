import React from "react";
import { Pagination } from "@nextui-org/react";

export default function PaginationComponent({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="mt-4">
      <Pagination
        loop
        showControls
        color="warning"
        total={totalPages}
        initialPage={currentPage} 
        onChange={(page) => onPageChange(page)}
      />
    </div>
  );
}
