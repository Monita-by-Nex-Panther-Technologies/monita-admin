
import { useState } from "react";
import { PaginationContent,Pagination, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "../ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { createEllipsePagination } from "@/utilities/utils";

interface PaginationProps {
  totalPages:number,
  page:number,
  limit:number,
  isLoading: boolean;
  handleChangePerPage: (page: number,limit: number) => void;
}

export default function GetPagination({
  totalPages,
  page,
  limit,
  isLoading,
  handleChangePerPage,
}: PaginationProps) {
  const [activePage, setActivePage] = useState(page ?? 1);
  const [goToPage, setGoToPage] = useState(page ?? "");

  const pageSizeOptions = [10,50, 100, 200, 300, 500];

  const isPageSizeChangeable = pageSizeOptions.filter(
    (number) => number <= totalPages
  ).length;

  if (!isLoading && totalPages < 1) {
    return null;
  }

  return isLoading ? (
    <div className="animate-pulse py-4 w-full rounded-lg flex items-center justify-between gap-8">
      <div className="bg-gray-400/50 animate-pulse h-4 w-1/5"></div>
      <div className="bg-gray-400/50 animate-pulse h-4 w-2/5"></div>
    </div>
  ) :

  <div className="flex flex-col md:flex-row gap-2 justify-between items-center mt-4 p-8 ">
  <div className="flex items-center gap-2">
      <span>Showing</span>
      <Select onValueChange={(value) => {
         handleChangePerPage(page,Number(value))
      }}>
          <SelectTrigger className="w-16 bg-background">
              {limit}
          </SelectTrigger>
          <SelectContent>
              {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={String(option)} >
                      {option}
                  </SelectItem>
              ))}
          </SelectContent>
      </Select>
      <span>Entries</span>
  </div>


  <Pagination className=" justify-end">
  <PaginationContent>
      <PaginationItem>
          <PaginationPrevious
              onClick={()=>handleChangePerPage(page - 1,limit)}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
      </PaginationItem>
            {createEllipsePagination(totalPages,
          page
        )?.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any

          (pageNum: any) => <PaginationItem  key={pageNum}>
          <PaginationLink
              isActive={pageNum === page}
              onClick={() => {
                setActivePage(pageNum);
                handleChangePerPage(pageNum,limit);
              }}
              className={pageNum === page ? "bg-primary  hover:bg-primary/90" : "cursor-pointer"}
          >
              {pageNum}
          </PaginationLink>
      </PaginationItem>

        )}
        
      <PaginationItem>
          <PaginationNext
               onClick={()=>handleChangePerPage(page + 1,limit)}
              className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
      </PaginationItem>
  </PaginationContent>
</Pagination>
    </div>
  
  
  
  // (
  //   <div className="flex items-center justify-between gap-4 flex-wrap text-[#333333] dark:text-gray-400  rounded-xl py-3">
  //     <div className="flex items-center gap-2 grow font-medium">
  //       <p>Page size </p>

  //       <select
  //         className="form-select bg-transparent rounded-md text-sm border border-[rgba(46,_16,_101,_0.12)] dark:text-gray-400 dark:border-gray-400 dark:bg-dark focus:outline-none py-2"
  //         name="perPage"
  //         value={data?.paginator?.limit}
  //         onChange={(e: ChangeEvent<HTMLSelectElement>) =>
  //           handlePageSizeChange(Number(e.target.value))
  //         }
  //         aria-label="Select result page"
  //       >
  //         {isPageSizeChangeable > 0 &&
  //           pageSizeOptions.map((item) => (
  //             <option
  //               value={item}
  //               key={item}
  //               selected={item === data?.paginator?.limit}
  //             >
  //               {item}
  //             </option>
  //           ))}

  //         {isPageSizeChangeable < 1 && (
  //           <option value={data?.paginator?.total}>
  //             {data?.paginator?.total}
  //           </option>
  //         )}
  //       </select>

  //       <div className="flex items-center ">
  //         <input
  //           id="pageInput"
  //           type="number"
  //           value={goToPage}
  //           onChange={(e) => setGoToPage(e.target.value)}
  //           placeholder=" page "
  //           className="p-2 text-sm w-12 border border-gray-300 rounded-tl rounded-bl   focus:outline-none focus:ring-2 focus:ring-red-500 text-center"
  //         />

  //         <button
  //           id="goButton"
  //           onClick={() => {
  //             if (goToPage) {
  //               setActivePage(goToPage);
  //               handleChangePerPage(Number(goToPage));
  //             }
  //           }}
  //           className="px-2 py-2 text-sm bg-red-800 text-white rounded-tr rounded-br hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
  //         >
  //           Go
  //         </button>
  //       </div>
  //     </div>

  //     <div className="flex items-center flex-wrap gap-1">
  //       <button
  //         className={cn(
  //           "px-3 py-1.5 text-sm rounded-lg font-medium text-brand-light-red border border-[rgba(46,_16,_101,_0.12)] dark:text-gray-400 dark:border-gray-400",
  //           {
  //             "text-[rgba(255,_107,_0,_0.25)] dark:bg-red-200 dark:text-white cursor-not-allowed":
  //               !data?.paginator?.hasPrevious,
  //           }
  //         )}
  //         type="button"
  //         onClick={() => {
  //           if (data?.paginator?.hasPrevious) {
  //             setActivePage((prev: number) => prev - 1);
  //             handleChangePerPage(activePage - 1);
  //           }
  //         }}
  //         disabled={!data?.paginator?.hasPrevious}
  //       >
  //         Prev
  //       </button>

  //       {createEllipsePagination(
  //         data?.paginator?.totalPages || data?.paginator?.total_pages,
  //         activePage
  //       )?.map(
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         (pageNum: any) =>
  //           pageNum === "..." ? (
  //             <div className="px-2" key={pageNum}>
  //               ...
  //             </div>
  //           ) : (
  //             <button
  //               key={pageNum}
  //               className={cn(
  //                 "px-3 py-1.5 text-sm rounded-lg hover:bg-brand-light-red hover:text-white border border-[rgba(46,_16,_101,_0.12)]dark:text-gray-400 dark:border-gray-400 ",
  //                 {
  //                   "bg-brand-light-red text-white": activePage === pageNum,
  //                 }
  //               )}
  //               type="button"
  //               onClick={() => {
  //                 setActivePage(pageNum);
  //                 handleChangePerPage(pageNum);
  //               }}
  //             >
  //               {pageNum}
  //             </button>
  //           )
  //       )}

  //       <button
  //         className={cn(
  //           "px-3 py-1.5 text-sm rounded-lg font-medium text-brand-light-red border border-[rgba(46,_16,_101,_0.12)] dark:text-gray-400 dark:border-gray-400",
  //           {
  //             "text-[rgba(255,_107,_0,_0.25)] dark:bg-red-200 dark:text-white cursor-not-allowed":
  //               !data?.paginator?.hasNext,
  //           }
  //         )}
  //         type="button"
  //         onClick={() => {
  //           if (data?.paginator?.hasNext) {
  //             setActivePage((prev: number) => prev + 1);
  //             handleChangePerPage(activePage + 1);
  //           }
  //         }}
  //         disabled={!data?.paginator?.hasNext}
  //       >
  //         Next
  //       </button>
  //     </div>
  //   </div>
  // );
}
