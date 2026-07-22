import { ChevronLeft, ChevronRight } from "lucide-react";

export type PaginationControlsProps = {
    totalPages: number,
    currentPage: number,
    goToPage: (pagenum: number) => void,
    handlePrevious: () => void,
    handleNext: () => void,
    setItemsPerPage: (value: number) => void
}

export default function PaginationControls({
    totalPages,
    currentPage,
    goToPage,
    handlePrevious,
    handleNext,
    setItemsPerPage
}: PaginationControlsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-center">
            <div className="hidden sm:block" />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center">
                    <button onClick={handlePrevious} disabled={currentPage === 1}
                        className="btn-primary rounded-full mx-2 px-2.5 disabled:opacity-40">
                        <ChevronLeft />
                    </button>
                    {/* Full number list (Only desktop) */}
                    <div className="hidden sm:flex items-center">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`rounded-full px-4.5 py-2 text-sm font-medium border-none mx-1 ${page === currentPage
                                ? "btn-primary"
                                : "hover:bg-slate-200 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                            }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    {/* Compact indicator (mobile only) */}
                    <span className="sm:hidden mx-2 text-sm font-medium text-muted">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}
                        className="btn-primary rounded-full mx-2 px-2.5 disabled:opacity-40">
                        <ChevronRight />
                    </button>
                </div>
                
            )}
            {/* Items Per Page Selector */}
            <div className="flex items-center justify-center gap-2">
                <label htmlFor="itemsperpage" className="text-sm">Per Page: </label>
                <select defaultValue={6}
                    name="itemsperpage" id="itemsperpage" 
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="form-input py-1 px-2 w-auto">
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                    <option value="24">24</option>
                    <option value="48">48</option>
                </select>
            </div>
        </div>
    );
}