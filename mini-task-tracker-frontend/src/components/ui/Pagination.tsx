import React from 'react';
import { Button } from './Button';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading = false
}) => {
    // Helper to generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Max number of page buttons to show (excluding first/last)

        if (totalPages <= maxVisiblePages + 2) {
            // If few pages, show all
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Complex logic for ellipses
            // Always show first page
            pages.push(0);

            // Calculate start and end for middle pages
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages - 2, currentPage + 1);

            // Adjust window if close to start/end
            if (currentPage <= 2) {
                end = 3;
            } else if (currentPage >= totalPages - 3) {
                start = totalPages - 4;
            }

            // Add ellipsis before middle
            if (start > 1) {
                pages.push('ellipsis-start');
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis after middle
            if (end < totalPages - 2) {
                pages.push('ellipsis-end');
            }

            // Always show last page
            pages.push(totalPages - 1);
        }
        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            <Button
                variant="secondary"
                onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0 || isLoading}
                className="!py-2 !px-3 text-sm disabled:opacity-50"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </Button>

            {getPageNumbers().map((page) => {
                if (typeof page === 'string') {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                }

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={isLoading}
                        className={`
                            min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                            ${currentPage === page
                                ? 'bg-uber-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }
                        `}
                    >
                        {page + 1}
                    </button>
                );
            })}

            <Button
                variant="secondary"
                onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1 || isLoading}
                className="!py-2 !px-3 text-sm disabled:opacity-50"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </Button>
        </div>
    );
};
