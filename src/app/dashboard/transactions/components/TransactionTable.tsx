"use client";
import React, { useState, useRef } from "react";
import FilterModal, { TransactionFilterCriteria } from "./TransactionFilterModal";
import { useTransactionStore } from "@/store/transactionStore";
import TableLoading from "@/components/table/TableLoading";
import GetPagination from "@/components/table/pagination";
import Empty from "@/components/table/Empty";
import TransactionTableContent from "./TransactionTableContent";
import TableActions from "@/components/table/TableActions";
import { toast } from "sonner";
import { formatedDate } from "@/utilities/utils";



const TransactionsTable = () => {
    const {
        transactions,
        page,
        totalPages,
        isFilterResult,
        limit,
        filterData,
        isLoading,
        setField,
        isQueryResult,
        getTransactions,
    } = useTransactionStore()


    const [selected, setSelected] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState("");


    const handleFilterApply = (newFilters: Partial<TransactionFilterCriteria>) => {
        setField("filterData", newFilters);
        getTransactions({ page, limit, ...newFilters });
      
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select all transactions in the current filtered view
            const allIds = transactions.map((transaction) => transaction.id);
            setSelected(allIds);
        } else {
            // Deselect all
            setSelected([]);
        }
    };

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    // const isSelected = (id: string) => selected.includes(id);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard: " + text);
    };

    const exportData = (format: string) => {
     
    };

    const onChangePage = (page: number, limit: number) => {

        getTransactions({ page, limit ,...filterData});

    };

    const handleSearchChange = () => {
        getTransactions({ page, limit, reference: searchValue });
    };

    const onResetSearch = () => {
        setSearchValue("");
        setField("isQueryResult", false);
        setField("filterData", null);
        setField("isFilterResult", false);
        setField("transactions", []);
        getTransactions({ page:1, limit });
    };


    return (
        <>
            <div className='w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px] mt-6'>
                <h1 className=' hidden md:flex text-text-title text-xl font-semibold font-poppins'>
                    Transaction History
                </h1>
                <div className='flex flex-row gap-x-4 '>
                    <button className='justify-center items-center bg-background border border-primary-300 text-text-body font-poppins font-medium px-3 w-[132px] rounded-[12px] active:bg-primary-foreground'>
                        Retry
                    </button>
                    <button className='justify-center bg-primary items-center text-text-body font-poppins py-3 w-[132px] rounded-[12px] font-medium'>
                        Approve
                    </button>
                </div>
            </div>

        

                        <div className="bg-background rounded-2xl my-6 py-4">

                          

                            <TableActions
                                    searchValue={searchValue}
                                    onSearch={handleSearchChange}
                                    onSearchChange={setSearchValue}
                                    onFilterClick={() => setIsFilterModalOpen(true)}
                                    areFiltersActive={isFilterResult}
                                    onResetFilters={onResetSearch}
                                    exportOptions={[
                                        { label: "Export as PDF", format: "PDF" },
                                        { label: "Export as XLS", format: "XLS" },
                                        { label: "Export as DOC", format: "DOC" },
                                    ]}
                                    onExport={exportData} 
                                     onResetSearch= {onResetSearch}
                                     isSearchActive={isQueryResult}                        />

<div className="mx-4">
{isFilterResult && (
				<div className="flex items-center flex-wrap gap-4 mb-3">
					{filterData?.startDate && (
						<span className="bg-primary text-black  text-xs p-2 rounded-2xl font-light">
							From: {formatedDate(filterData.startDate.toDateString()) }
						</span>
					)}
					{filterData?.endDate && (
						<span className="bg-primary text-black  text-xs p-2 rounded-2xl font-light">
							To:{formatedDate(filterData.endDate.toDateString()) }
						</span>
					)}
					{filterData?.type && (
						<span className="bg-primary text-black  text-xs p-2 rounded-2xl font-light">
							Type: {filterData?.type}
						</span>
					)}
					{filterData?.status && (
						<span className="bg-primary text-black  text-xs p-2 rounded-2xl font-light ">
							Status: {filterData?.status}
						</span>
					)}
					{filterData?.category && (
						<span className="bg-primary text-black  text-xs p-2 rounded-2xl font-light ">
							Service: {filterData?.category}
						</span>
					)}
					
				</div>
			)}
</div>


{
                isLoading ? <TableLoading
                    row={11}
                    col={20}
                /> :

                    transactions.length === 0 ? (
                        <Empty
                            title="No Transactions"
                            description="Once a transaction is made, it will appear here with all the details you need to track and manage it easily."
                        />
                    ) : (

                            <TransactionTableContent
                                transactions={transactions}
                                selected={selected}
                                handleSelectAll={handleSelectAll}
                                handleSelect={handleSelect}
                                copyToClipboard={copyToClipboard}
                            />

                       

                    )
            }
 </div>

                        {transactions.length > 0 && <GetPagination
                            page={page}
                            totalPages={totalPages}
                            limit={limit}
                            isLoading={isLoading}
                            handleChangePerPage={onChangePage} />}



            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
            />
        </>
    );
};

export default TransactionsTable;




// const dataToExport = selected.length > 0
//     ? filteredTransactions.filter((transaction) => selected.includes(transaction.id))
//     : filteredTransactions;

// if (format === "DOC") {
//     const docContent = dataToExport.map(t => `${t.username}\t${t.id}\t${t.amount}\t${t.type}\t${t.status}\t${t.date} ${t.time}`).join("\n");
//     const blob = new Blob([docContent], { type: "application/msword" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "transactions.doc";
//     a.click();
//     URL.revokeObjectURL(url);
// } else if (format === "XLS") {
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
//     XLSX.writeFile(workbook, "transactions.xlsx");
// } else if (format === "PDF") {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.text("Transaction History", 14, 22);

//     const cleanedData = dataToExport.map(transaction => ({
//         ...transaction,
//         amount: cleanAmount(transaction.amount)
//     }));

//     autoTable(doc, {
//         head: [['Username', 'Transaction ID', 'Amount', 'Type', 'Status', 'Date', 'Time']],
//         body: cleanedData.map(transaction => [
//             transaction.username,
//             transaction.id,
//             transaction.amount,
//             transaction.type,
//             transaction.status,
//             transaction.date,
//             transaction.time
//         ]),
//         startY: 30,
//         styles: {
//             fontSize: 10,
//             cellPadding: 3,
//             font: "helvetica",
//             fontStyle: "normal",
//             textColor: [0, 0, 0],
//             halign: "left",
//         },
//         headStyles: {
//             fillColor: [41, 128, 185],
//             textColor: 255,
//             fontStyle: "bold",
//         },
//         columnStyles: {
//             2: {
//                 fontStyle: "normal",
//                 halign: "right",
//                 cellWidth: "wrap",
//             },
//             4: {
//                 fontStyle: 'bold',
//             }
//         },
//         didParseCell: function (data) {
//             if (data.section === 'body' && data.column.index === 4) {
//                 const status = data.cell.raw;
//                 if (status === 'Successful') {
//                     data.cell.styles.textColor = [46, 204, 113];
//                 } else if (status === 'Failed') {
//                     data.cell.styles.textColor = [231, 76, 60];
//                 } else {
//                     data.cell.styles.textColor = [243, 156, 18];
//                 }
//             }
//         }
//     });

//     const pageCount = doc.getNumberOfPages();
//     for (let i = 1; i <= pageCount; i++) {
//         doc.setPage(i);
//         doc.setFontSize(8);
//         doc.setFont("helvetica", "normal");
//         doc.text(
//             `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
//             doc.internal.pageSize.getWidth() / 2,
//             doc.internal.pageSize.getHeight() - 10,
//             { align: 'center' }
//         );
//     }

//     doc.save("transactions.pdf");
// }

// setExportDropdownOpen(false);