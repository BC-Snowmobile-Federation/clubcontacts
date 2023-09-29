import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
// eslint-disable-next-line
function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Determine the range of page numbers to display
  const startPage = Math.max(currentPage - 2, 1);
  const endPage = Math.min(startPage + 4, totalPages);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 mt-4 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(1); // Go to the first page
          }}
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ArrowLongLeftIcon
            className="mr-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          First
        </a>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {Array.from({ length: endPage - startPage + 1 }).map((_, idx) => {
          const pageNumber = startPage + idx;
          return (
            <a
              key={pageNumber}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(pageNumber);
              }}
              className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${
                pageNumber === currentPage
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {pageNumber}
            </a>
          );
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(totalPages); // Go to the last page
          }}
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Last
          <ArrowLongRightIcon
            className="ml-3 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </a>
      </div>
    </nav>
  );
}

export default Pagination;
