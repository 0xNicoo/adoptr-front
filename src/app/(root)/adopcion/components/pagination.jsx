
import React from "react";
import { Pagination } from "@nextui-org/react";

export default function PaginationComponent({ totalPages, currentPage, onPageChange }) {
  return (
    <div className="mt-4">
      <Pagination
        loop
        showControls
        color="success"
        total={totalPages}
        initialPage={currentPage}
        onChange={onPageChange}
      />
    </div>
  );
}
