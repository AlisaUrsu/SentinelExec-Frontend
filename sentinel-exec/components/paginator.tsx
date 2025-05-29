import React from "react";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination"; // adjust import based on your file structure
import { generatePaginationLinks } from "./generate-pages";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function Paginator({ totalPages, currentPage, onPageChange, className }: PaginationProps) {
  if (totalPages === 0) return null;
  

  return (
    <UIPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            className={currentPage <= 1 ? "invisible" : "select-none cursor-pointer"}
          />
        </PaginationItem>

       {generatePaginationLinks(currentPage, totalPages, onPageChange)}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            className={currentPage === totalPages ? "invisible" : "select-none cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
