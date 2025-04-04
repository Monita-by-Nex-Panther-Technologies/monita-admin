"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, MoreHorizontal, ListFilter, Copy, Trash2 } from 'lucide-react'
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import { DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog"
import { Dialog } from "@/components/ui/dialog"


const accounts = [
    { id: 1, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Active", accountNumber: "10291112011111" },
    { id: 2, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Active", accountNumber: "10291112011111" },
    { id: 3, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Inactive", accountNumber: "10291112011111" },
    { id: 4, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Active", accountNumber: "10291112011111" },
    { id: 5, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Active", accountNumber: "10291112011111" },
    { id: 6, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Inactive", accountNumber: "10291112011111" },
    { id: 7, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Active", accountNumber: "10291112011111" },
    { id: 8, name: "Ade Johnson", email: "Adejohn@gmail.com", status: "Active", accountNumber: "10291112011111" },
]

const itemsPerPageOptions = [5, 10, 20, 50]

export default function VirtualAccountsList() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(20)
    const [selected, setSelected] = useState<number[]>([])
    const [searchTerm, setSearchTerm] = useState("")

    const filteredAccounts = accounts.filter((account) => {
        return searchTerm
            ? account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.accountNumber.includes(searchTerm)
            : true
    })

    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
    const paginatedData = filteredAccounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = filteredAccounts.map((account) => account.id)
            setSelected(allIds)
        } else {
            setSelected([])
        }
    }

    const handleSelect = (id: number) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copied to clipboard: " + text)
    }

    const renderPaginationItems = () => {
        const items = []
        items.push(
            <PaginationItem key="page-1">
                <PaginationLink
                    isActive={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className={currentPage === 1 ? "bg-primary text-white hover:bg-primary/90" : ""}
                >
                    1
                </PaginationLink>
            </PaginationItem>,
        )
        if (totalPages <= 7) {
            for (let i = 2; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={`page-${i}`}>
                        <PaginationLink
                            isActive={currentPage === i}
                            onClick={() => setCurrentPage(i)}
                            className={currentPage === i ? "bg-primary text-white hover:bg-primary/90" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                )
            }
        } else {
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)
            if (currentPage <= 3) {
                startPage = 2
                endPage = 4
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3
                endPage = totalPages - 1
            }
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="ellipsis-1">
                        <PaginationEllipsis />
                    </PaginationItem>,
                )
            }
            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={`page-${i}`}>
                        <PaginationLink
                            isActive={currentPage === i}
                            onClick={() => setCurrentPage(i)}
                            className={currentPage === i ? "bg-primary text-white hover:bg-primary/90" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                )
            }
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="ellipsis-2">
                        <PaginationEllipsis />
                    </PaginationItem>,
                )
            }
            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={`page-${totalPages}`}>
                        <PaginationLink
                            isActive={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className={currentPage === totalPages ? "bg-primary text-white hover:bg-primary/90" : ""}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>,
                )
            }
        }
        return items
    }

    return (
        <>
            <div className='w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px] mt-6'>
                <h1 className='text-text-title text-xl font-semibold font-poppins'>
                    Virtual Accounts Lists
                </h1>
                <div className='flex flex-row gap-x-4'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className='flex justify-center items-center bg-gray-100 border border-gray-300 text-gray-700 font-poppins font-medium px-6 py-3 rounded-md hover:bg-gray-200 transition'>
                                Block Account
                            </button>
                        </DialogTrigger>
                        <DialogContent className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 bg-opacity-50">
                            <div className="bg-white rounded-lg shadow-lg p-6 w-[500px]" onClick={(e) => e.stopPropagation()}>

                                <DialogTitle className="text-lg font-semibold text-gray-800 flex items-center gap-1 mb-1 "> <Trash2 className="text-red-500" size={16} /> Block Account</DialogTitle>
                                <p className="text-gray-600 mb-4">
                                    Blocking this account will revoke their access and permissions. This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-2 w-full mt-10">
                                    <DialogClose asChild>
                                        <button className="flex-1 border py-3 border-[#CEEF0A] text-[#CEEF0A] font-poppins font-medium px-4 rounded-full hover:bg-gray-50 transition">
                                            Cancel
                                        </button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <button className="flex-1 bg-[#CEEF0A] text-text-title font-poppins font-medium px-4 py-2 rounded-full transition flex items-center justify-center gap-2">
                                            Block Account
                                        </button>
                                    </DialogClose>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <button className='justify-center bg-[#22C55E] items-center text-white font-poppins font-medium px-6 py-3 rounded-[12px]'>
                        Unblock
                    </button>
                </div>
            </div>

            <div className="bg-background rounded-2xl my-6 py-4">
                <div className="flex justify-between items-center my-4 px-6">
                    <div className="flex flex-row gap-5">
                        <button
                            className="border border-primary bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]"
                        >
                            <ListFilter size={16} />
                            <span className="text-text-title font-poppins text-base">Filter</span>
                        </button>

                        <div className="flex flex-row justify-center items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-background-alt border-border rounded-l-[8px] p-4"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button className="bg-primary rounded-r-[8px] p-4 px-6">
                                <Search size={24} className="text-text-body" />
                            </button>
                        </div>
                    </div>

                    <button className="bg-[#010101CC] flex gap-3 justify-center items-center px-6 py-3 rounded-[12px] text-white">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.66699 6.66699L8.00033 10.0003L11.3337 6.66699" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 10V2" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-poppins text-base">Export</span>
                    </button>
                </div>

                <div className="overflow-auto relative">
                    <Table className="w-full rounded-2xl bg-background p-5">
                        <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
                            <TableRow>
                                <TableHead className="p-4">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                                        checked={selected.length === filteredAccounts.length && selected.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Name</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Email Address</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Account Status</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Account Number</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((account) => (
                                <TableRow key={account.id} className="py-6">
                                    <TableCell className="p-4">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 mt-1 cursor-pointer"
                                            checked={selected.includes(account.id)}
                                            onChange={() => handleSelect(account.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{account.name}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{account.email}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">
                                        <span
                                            className={`px-2 py-1 rounded-md w-full ${account.status === "Active" ? "status-success" : "status-error"
                                                }`}
                                        >
                                            {account.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2">
                                        {account.accountNumber}
                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(account.accountNumber)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent"
                                        >
                                            <MoreHorizontal size={14} className="text-primary-300" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 p-8">
                <div className="flex items-center gap-2">
                    <span>Showing</span>
                    <Select
                        onValueChange={(value) => {
                            setItemsPerPage(Number(value))
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-16 bg-background">{itemsPerPage}</SelectTrigger>
                        <SelectContent>
                            {itemsPerPageOptions.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>Entries</span>
                </div>

                <Pagination className="justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={handlePrevPage}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {renderPaginationItems()}

                        <PaginationItem>
                            <PaginationNext
                                onClick={handleNextPage}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    )
}