"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BlockUserDialog } from "../components/block-user-dialog"
import Image from "next/image"

// Client component receives id as a prop instead of params
interface UserDetailsClientProps {
    id: string
}

export default function UserDetailsPage({ id }: UserDetailsClientProps) {
    const [blockDialogOpen, setBlockDialogOpen] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selected, setSelected] = useState<string[]>([])
    const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false)
    const [userData, setUserData] = useState({
        id: id,
        name: "Ade Johnson",
        email: "Adejohn@gmail.com",
        phone: "09012345678",
        address: "Ikeja, Lagos",
        status: "Approved",
        registrationDate: "Jan 02, 2024 4:30pm",
        imageVerified: true,
        imageMatch: "38%",
        device: {
            name: "iPhone 14 Pro",
            os: "iOS 17",
            ipAddress: "192.168.1.1",
            location: "Lagos, Nigeria",
        },
        provider: {
            response: "Failed",
            statusCode: "401",
            processTime: "60 minutes",
            details: "Nomiworldi",
        },
        transactions: [
            {
                id: "10291112011111",
                username: "Adebayo10",
                amount: "₦10,000",
                type: "Airtime",
                status: "Successful",
                dateTime: "Jan 02, 2024 4:30pm",
            },
            {
                id: "10291112011112",
                username: "Adebami10",
                amount: "₦10,000",
                type: "Airtime",
                status: "Pending",
                dateTime: "Jan 02, 2024 4:30pm",
            },
            {
                id: "10291112011113",
                username: "Adebami10",
                amount: "₦10,000",
                type: "Airtime",
                status: "Pending",
                dateTime: "Jan 02, 2024 4:30pm",
            },
        ],
    })

    const router = useRouter()

    const handleGoBack = () => {
        router.push("/dashboard/customers")
    }

    const handleResetPassword = () => {
        alert("Password reset functionality would be implemented here")
    }

    const handleSaveChanges = () => {
        alert("Changes saved successfully")
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = userData.transactions.map((tx) => tx.id)
            setSelected(allIds)
        } else {
            setSelected([])
        }
    }

    const handleSelect = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]))
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData((prev) => ({ ...prev, name: e.target.value }))
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData((prev) => ({ ...prev, email: e.target.value }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData((prev) => ({ ...prev, phone: e.target.value }))
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData((prev) => ({ ...prev, address: e.target.value }))
    }

    const exportData = (format: string) => {
        alert(`Export as ${format} would be implemented here`)
        setExportDropdownOpen(false)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Successful":
                return "bg-[#E6F7EF] text-[#00A85A]"
            case "Pending":
                return "bg-[#FFF8E6] text-[#FFA500]"
            case "Failed":
                return "bg-[#FFEBEB] text-[#FF0000]"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handleGoBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold">{userData.name}</h1>
                </div>
                <div className="flex flex-row gap-x-4">
                    <button
                        className="justify-center items-center bg-white border border-green-500 text-green-500 font-medium px-4 py-2 rounded-[12px]"
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </button>
                    <button
                        className="justify-center bg-red-500 items-center text-white font-medium px-4 py-2 rounded-[12px]"
                        onClick={() => setBlockDialogOpen(true)}
                    >
                        Block
                    </button>
                </div>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-lg mt-6 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                                <Image
                                    src="/placeholder.svg"
                                    alt={userData.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {userData.imageVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M20 6L9 17L4 12"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="font-semibold">Image Verified</div>
                            <div className="text-sm text-gray-500">Match: {userData.imageMatch}</div>
                        </div>
                    </div>
                    <button className="bg-[#DDFF00] text-black font-medium px-4 py-2 rounded-[12px]" onClick={handleSaveChanges}>
                        Save Changes
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Name</p>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            value={userData.name}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Email Address</p>
                        <input
                            type="email"
                            className="w-full p-2 border rounded-md"
                            value={userData.email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                        <input
                            type="tel"
                            className="w-full p-2 border rounded-md"
                            value={userData.phone}
                            onChange={handlePhoneChange}
                        />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Address</p>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            value={userData.address}
                            onChange={handleAddressChange}
                        />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Status</p>
                        <span className="px-4 py-2 rounded-md bg-[#E6F7EF] text-[#00A85A] inline-block">{userData.status}</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Registration Date</p>
                        <p className="font-medium">{userData.registrationDate}</p>
                    </div>
                </div>
            </div>

            {/* Device Info */}
            <div className="bg-white rounded-lg mt-6 p-6">
                <h2 className="text-lg font-semibold mb-4">Device Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Name</p>
                        <p className="font-medium">{userData.device.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">OS</p>
                        <p className="font-medium">{userData.device.os}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">IP Address</p>
                        <p className="font-medium text-blue-500">{userData.device.ipAddress}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Location</p>
                        <p className="font-medium">{userData.device.location}</p>
                    </div>
                </div>
            </div>

            {/* Other Details */}
            <div className="bg-white rounded-lg mt-6 p-6">
                <h2 className="text-lg font-semibold mb-4">Other Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Provider response</p>
                        <span className="px-4 py-1 rounded-md bg-[#FFEBEB] text-[#FF0000] inline-block">
                            {userData.provider.response}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Status Code</p>
                        <p className="font-medium">{userData.provider.statusCode}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Process Time</p>
                        <p className="font-medium">{userData.provider.processTime}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Provider details</p>
                        <p className="font-medium">{userData.provider.details}</p>
                    </div>
                </div>
            </div>

            {/* Transactions */}
            <div className="bg-white rounded-lg mt-6 p-6">
                <div className="flex justify-between items-center my-4">
                    <div className="flex flex-row gap-5">
                        <button className="border border-[#CCCCCC] bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M5 10H15"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M2.5 5H17.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M7.5 15H12.5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-base">Filter</span>
                        </button>

                        <div className="flex flex-row justify-center items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-[#F5F5F5] border border-[#CCCCCC] rounded-l-[8px] p-4"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button className="bg-[#DDFF00] rounded-r-[8px] p-4 px-6">
                                <Search size={24} className="text-black" />
                            </button>
                        </div>
                    </div>

                    {/* Export Button */}
                    <div className="relative">
                        <button
                            className="bg-[#010101CC] flex gap-3 justify-center items-center px-6 py-3 rounded-[12px] text-white"
                            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                                    stroke="white"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4.66699 6.66699L8.00033 10.0003L11.3337 6.66699"
                                    stroke="white"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path d="M8 10V2" stroke="white" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-medium text-base">Export</span>
                        </button>

                        {exportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-32 rounded-md shadow-xl py-1 bg-white z-10">
                                <button
                                    className="block px-4 py-2 text-sm text-gray-700 w-full border-border hover:bg-gray-100 text-left border-b"
                                    onClick={() => exportData("PDF")}
                                >
                                    Export as PDF
                                </button>
                                <button
                                    className="block px-4 py-2 text-sm text-gray-700 w-full border-border hover:bg-gray-100 text-left border-b"
                                    onClick={() => exportData("XLS")}
                                >
                                    Export as XLS
                                </button>
                                <button
                                    className="block px-4 py-2 text-sm text-nowrap text-gray-700 w-full border-border hover:bg-gray-100 text-left border-b"
                                    onClick={() => exportData("DOC")}
                                >
                                    Export as DOC
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-auto">
                    <Table className="w-full rounded-2xl bg-background p-5">
                        <TableHeader className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
                            <TableRow>
                                <TableHead className="p-4">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                                        checked={selected.length === userData.transactions.length && selected.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="text-base font-medium">Username</TableHead>
                                <TableHead className="text-base font-medium">Transaction ID</TableHead>
                                <TableHead className="text-base font-medium">Amount</TableHead>
                                <TableHead className="text-base font-medium">Type</TableHead>
                                <TableHead className="text-base font-medium">Status</TableHead>
                                <TableHead className="text-base font-medium">Date & Time</TableHead>
                                <TableHead className="text-base font-medium">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userData.transactions.map((tx, index) => (
                                <TableRow key={index} className="py-6">
                                    <TableCell className="p-4">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 mt-1 cursor-pointer"
                                            checked={selected.includes(tx.id)}
                                            onChange={() => handleSelect(tx.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-base py-6">{tx.username}</TableCell>
                                    <TableCell className="text-base py-6 flex items-center gap-2">
                                        {tx.id}
                                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(tx.id)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-base py-6">{tx.amount}</TableCell>
                                    <TableCell className="text-base py-6">{tx.type}</TableCell>
                                    <TableCell className="text-base py-6">
                                        <span className={`px-4 py-2 rounded-md ${getStatusColor(tx.status)}`}>{tx.status}</span>
                                    </TableCell>
                                    <TableCell className="text-base py-6">{tx.dateTime}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            className="cursor-pointer border border-[#DDFF00] rounded-sm hover:bg-transparent"
                                        >
                                            <MoreHorizontal size={14} className="text-[#DDFF00]" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <BlockUserDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen} />
        </div>
    )
}

