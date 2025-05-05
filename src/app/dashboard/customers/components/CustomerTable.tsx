"use client";
import React, { useState, useRef } from "react";
import FilterModal, { FilterCriteria } from "./CustomerFilterModal";
import { CustomerQueryParams, useCustomerStore } from "@/store/customerStore";
import TableLoading from "@/components/table/TableLoading";
import GetPagination from "@/components/table/pagination";
import Empty from "@/components/table/Empty";
import CustomerTableContent from "./CustomerTableContent";
import TableActions from "@/components/table/TableActions";
import { toast } from "sonner";
import { formatedDate, isEmail, replacePrefix } from "@/utilities/utils";



const CustomersTable = () => {
    const {
        customers,
        page,
        totalPages,
        isFilterResult,
        limit,
        filterData,
        isLoading,
        setField,
        isQueryResult,
        getCustomers,
    } = useCustomerStore()


    const [selected, setSelected] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState("");


    const handleFilterApply = (newFilters: Partial<FilterCriteria>) => {
        setField("filterData", newFilters);
        getCustomers({ page, limit, ...newFilters });
      
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select all customers in the current filtered view
            const allIds = customers.map((customer) => customer.id);
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

        getCustomers({ page, limit ,...filterData});

    };

    const handleSearchChange = () => {

        const payload:CustomerQueryParams  = { page, limit }

        if (isEmail(searchValue)) {
            payload.email = searchValue
        }else{
            payload.phone = replacePrefix(searchValue)
        }




        getCustomers(payload);
    };

    const onResetSearch = () => {
        setSearchValue("");
        setField("isQueryResult", false);
        setField("filterData", null);
        setField("isFilterResult", false);
        setField("customers", []);
        getCustomers({ page:1, limit });
    };


    return (
        <>
         
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

                    customers.length === 0 ? (
                        <Empty
                            title="No Customers"
                            description="Once a customer is made, it will appear here with all the details you need to track and manage it easily."
                        />
                    ) : (

                            <CustomerTableContent
                                customers={customers}
                                selected={selected}
                                handleSelectAll={handleSelectAll}
                                handleSelect={handleSelect}
                                copyToClipboard={copyToClipboard}
                            />

                       

                    )
            }
 </div>

                        {customers.length > 0 && <GetPagination
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

export default CustomersTable;




// const dataToExport = selected.length > 0
//     ? filteredCustomers.filter((customer) => selected.includes(customer.id))
//     : filteredCustomers;

// if (format === "DOC") {
//     const docContent = dataToExport.map(t => `${t.username}\t${t.id}\t${t.amount}\t${t.type}\t${t.status}\t${t.date} ${t.time}`).join("\n");
//     const blob = new Blob([docContent], { type: "application/msword" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "customers.doc";
//     a.click();
//     URL.revokeObjectURL(url);
// } else if (format === "XLS") {
//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
//     XLSX.writeFile(workbook, "customers.xlsx");
// } else if (format === "PDF") {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.setFont("helvetica", "bold");
//     doc.text("Customer History", 14, 22);

//     const cleanedData = dataToExport.map(customer => ({
//         ...customer,
//         amount: cleanAmount(customer.amount)
//     }));

//     autoTable(doc, {
//         head: [['Username', 'Customer ID', 'Amount', 'Type', 'Status', 'Date', 'Time']],
//         body: cleanedData.map(customer => [
//             customer.username,
//             customer.id,
//             customer.amount,
//             customer.type,
//             customer.status,
//             customer.date,
//             customer.time
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

//     doc.save("customers.pdf");
// }

// setExportDropdownOpen(false);