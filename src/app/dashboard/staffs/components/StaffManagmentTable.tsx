"use client";
import React from "react";
import StaffTable from "./StaffTable";

const StaffManagementTable = () => {
  return (
    <div className="w-full">
      <StaffTable />
    </div>
  );
};

export default StaffManagementTable;

// "use client"
// import type React from "react"
// import { useState, useRef } from "react"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Search, ListFilter, Pencil, Trash2, Plus } from "lucide-react"
// import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"

// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious,
//     PaginationEllipsis,
// } from "@/components/ui/pagination"

// // Sample data for staff members
// const staffMembers = [
//     { id: "1", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
//     { id: "2", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
//     { id: "3", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
//     { id: "4", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
//     { id: "5", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
//     { id: "6", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
//     { id: "7", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
//     { id: "8", name: "Ade Johnson", email: "Adejohn@gmail.com", role: "Product Manager" },
// ]

// const itemsPerPageOptions = [5, 10, 20, 50]

// const StaffManagementTable = () => {
//     const [currentPage, setCurrentPage] = useState<number>(1)
//     const [itemsPerPage, setItemsPerPage] = useState<number>(20)
//     const [selected, setSelected] = useState<string[]>([])
//     const [searchTerm, setSearchTerm] = useState<string>("")

//     const tableRef = useRef<HTMLDivElement>(null)

//     const filteredStaff = staffMembers.filter((staff) => {
//         // Search filter
//         return searchTerm
//             ? staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             staff.role.toLowerCase().includes(searchTerm.toLowerCase())
//             : true
//     })

//     const totalPages = Math.ceil(filteredStaff.length / itemsPerPage)
//     const paginatedData = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value)
//         setCurrentPage(1) // Reset to the first page when search term changes
//     }

//     const handleNextPage = () => {
//         if (currentPage < totalPages) setCurrentPage(currentPage + 1)
//     }

//     const handlePrevPage = () => {
//         if (currentPage > 1) setCurrentPage(currentPage - 1)
//     }

//     const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.checked) {
//             // Select all staff in the current filtered view
//             const allIds = filteredStaff.map((staff) => staff.id)
//             setSelected(allIds)
//         } else {
//             // Deselect all
//             setSelected([])
//         }
//     }

//     const handleSelect = (id: string) => {
//         setSelected((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
//     }

//     const renderPaginationItems = () => {
//         const items = []
//         items.push(
//             <PaginationItem key="page-1">
//                 <PaginationLink
//                     isActive={currentPage === 1}
//                     onClick={() => setCurrentPage(1)}
//                     className={currentPage === 1 ? "bg-primary text-white hover:bg-primary/90" : ""}
//                 >
//                     1
//                 </PaginationLink>
//             </PaginationItem>,
//         )
//         if (totalPages <= 7) {
//             for (let i = 2; i <= totalPages; i++) {
//                 items.push(
//                     <PaginationItem key={`page-${i}`}>
//                         <PaginationLink
//                             isActive={currentPage === i}
//                             onClick={() => setCurrentPage(i)}
//                             className={currentPage === i ? "bg-primary text-white hover:bg-primary/90" : ""}
//                         >
//                             {i}
//                         </PaginationLink>
//                     </PaginationItem>,
//                 )
//             }
//         } else {
//             let startPage = Math.max(2, currentPage - 1)
//             let endPage = Math.min(totalPages - 1, currentPage + 1)
//             if (currentPage <= 3) {
//                 startPage = 2
//                 endPage = 4
//             } else if (currentPage >= totalPages - 2) {
//                 startPage = totalPages - 3
//                 endPage = totalPages - 1
//             }
//             if (startPage > 2) {
//                 items.push(
//                     <PaginationItem key="ellipsis-1">
//                         <PaginationEllipsis />
//                     </PaginationItem>,
//                 )
//             }
//             for (let i = startPage; i <= endPage; i++) {
//                 items.push(
//                     <PaginationItem key={`page-${i}`}>
//                         <PaginationLink
//                             isActive={currentPage === i}
//                             onClick={() => setCurrentPage(i)}
//                             className={currentPage === i ? "bg-primary text-white hover:bg-primary/90" : ""}
//                         >
//                             {i}
//                         </PaginationLink>
//                     </PaginationItem>,
//                 )
//             }
//             if (endPage < totalPages - 1) {
//                 items.push(
//                     <PaginationItem key="ellipsis-2">
//                         <PaginationEllipsis />
//                     </PaginationItem>,
//                 )
//             }
//             if (totalPages > 1) {
//                 items.push(
//                     <PaginationItem key={`page-${totalPages}`}>
//                         <PaginationLink
//                             isActive={currentPage === totalPages}
//                             onClick={() => setCurrentPage(totalPages)}
//                             className={currentPage === totalPages ? "bg-primary text-white hover:bg-primary/90" : ""}
//                         >
//                             {totalPages}
//                         </PaginationLink>
//                     </PaginationItem>,
//                 )
//             }
//         }
//         return items
//     }

//     return (
//         <>
//             <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px] mt-6">
//                 <h1 className="text-text-title text-xl font-semibold font-poppins">Staff Management</h1>
//                 <div className="flex flex-row gap-x-4">
//                     <button className="justify-center items-center bg-background border border-primary-300 text-text-body font-poppins font-medium px-4 py-2 rounded-[12px] active:bg-primary-foreground">
//                         Manage Roles
//                     </button>
//                     <button className="justify-center bg-primary items-center text-text-body font-poppins px-4 py-2 rounded-[12px] font-medium flex gap-2">
//                         <Plus size={16} />
//                         Add Staff
//                     </button>
//                 </div>
//             </div>

//             <div className="bg-background rounded-2xl my-6 py-4">
//                 <div className="flex justify-between items-center my-4 px-6">
//                     <div className="flex flex-row gap-5">
//                         <button className="border border-primary bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]">
//                             <ListFilter size={16} />
//                             <span className="text-text-title font-poppins text-base">Filter</span>
//                         </button>

//                         <div className="flex flex-row justify-center items-center">
//                             <input
//                                 type="text"
//                                 placeholder="Search"
//                                 className="bg-background-alt border-border rounded-l-[8px] p-4"
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                             />
//                             <button className="bg-primary rounded-r-[8px] p-4 px-6">
//                                 <Search size={24} className="text-text-body" />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="flex gap-4">
//                         <button className="border border-primary-300 bg-background text-text-body font-poppins px-6 py-3 rounded-[8px]">
//                             Reinvite
//                         </button>
//                         <button className="bg-[#010101] text-white font-poppins px-6 py-3 rounded-[8px]">Remove Staff</button>
//                     </div>
//                 </div>

//                 <div className="overflow-auto relative" ref={tableRef}>
//                     <Table className="w-full rounded-2xl bg-background p-5">
//                         <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
//                             <TableRow>
//                                 <TableHead className="p-4">
//                                     <input
//                                         type="checkbox"
//                                         className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
//                                         checked={selected.length === filteredStaff.length && selected.length > 0}
//                                         onChange={handleSelectAll}
//                                     />
//                                 </TableHead>
//                                 <TableHead className="text-base font-poppins text-text-title">Name</TableHead>
//                                 <TableHead className="text-base font-poppins text-text-title">Email Address</TableHead>
//                                 <TableHead className="text-base font-poppins text-text-title">Assigned Role</TableHead>
//                                 <TableHead className="text-base font-poppins text-text-title">Action</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {paginatedData.map((staff) => (
//                                 <TableRow key={staff.id} className="py-6">
//                                     <TableCell className="p-4">
//                                         <input
//                                             type="checkbox"
//                                             className="w-6 h-6 mt-1 cursor-pointer"
//                                             checked={selected.includes(staff.id)}
//                                             onChange={() => handleSelect(staff.id)}
//                                         />
//                                     </TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">{staff.name}</TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">{staff.email}</TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">{staff.role}</TableCell>
//                                     <TableCell className="py-6 flex gap-4">
//                                         <Button variant="ghost" className="cursor-pointer hover:bg-transparent p-0">
//                                             <Pencil size={18} className="text-gray-600" />
//                                         </Button>
//                                         <Button variant="ghost" className="cursor-pointer hover:bg-transparent p-0">
//                                             <Trash2 size={18} className="text-red-500" />
//                                         </Button>
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//             </div>

//             <div className="flex justify-between items-center mt-4 p-8">
//                 <div className="flex items-center gap-2">
//                     <span>Showing</span>
//                     <Select
//                         onValueChange={(value) => {
//                             setItemsPerPage(Number(value))
//                             setCurrentPage(1)
//                         }}
//                         defaultValue="20"
//                     >
//                         <SelectTrigger className="w-16 bg-background">{itemsPerPage}</SelectTrigger>
//                         <SelectContent>
//                             {itemsPerPageOptions.map((option) => (
//                                 <SelectItem key={option} value={String(option)}>
//                                     {option}
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                     <span>Entries</span>
//                 </div>

//                 <Pagination className="justify-end">
//                     <PaginationContent>
//                         <PaginationItem>
//                             <PaginationPrevious
//                                 onClick={handlePrevPage}
//                                 className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                             />
//                         </PaginationItem>

//                         {renderPaginationItems()}

//                         <PaginationItem>
//                             <PaginationNext
//                                 onClick={handleNextPage}
//                                 className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
//                             />
//                         </PaginationItem>
//                     </PaginationContent>
//                 </Pagination>
//             </div>
//         </>
//     )
// }

// export default StaffManagementTable

