import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationControlsProps } from "../../lib/types";

export default function PaginationControls({
    totalPages,
    currentPage,
    goToPage,
    handlePrevious,
    handleNext,
    setItemsPerPage
}: PaginationControlsProps) {
    return (
        <>
        {/* Pagination Controls */}
        <div className="grid grid-cols-3">
            {totalPages > 1 && (
                <div className="flex w-full mx-auto justify-center col-2">
                    <button onClick={handlePrevious} disabled={currentPage === 1}
                        className="btn-primary rounded-full mx-2 px-2.5">
                        <ChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`rounded-full px-4.5 py-0 text-sm font-medium border-none mx-1 ${page === currentPage
                            ? "btn-primary"
                            : "hover:bg-slate-200 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                        }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button onClick={handleNext} disabled={currentPage === totalPages}
                        className="btn-primary rounded-full mx-2 px-2.5">
                        <ChevronRight />
                    </button>
                </div>
                
            )}
            {/* Items Per Page Selector */}
            <div className="my-auto mx-auto col-3">
                <label htmlFor="itemsperpage">Per Page: </label>
                <select defaultValue={12}
                    name="itemsperpage" id="itemsperpage" 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                </select>
            </div>
        </div>
        </>
    );
}