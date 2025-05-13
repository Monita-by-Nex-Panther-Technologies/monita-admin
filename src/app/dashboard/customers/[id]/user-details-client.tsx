"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BlockUserDialog } from "../components/block-user-dialog"
import { useTransactionStore } from "@/store/transactionStore"
import { toast } from "sonner"
import { useCustomerStore } from "@/store/customerStore"
import DetailsLoading from "@/components/ui/DetailsLoading"
import { formatAmount, formatedDate } from "@/utilities/utils"
import { maskData } from "@/utilities/masks"
import TableActions from "@/components/table/TableActions"
import FilterModal from "../components/CustomerFilterModal"
import GetPagination from "@/components/table/pagination"
import TransactionTableContent from "../../transactions/components/TransactionTableContent"
import Empty from "@/components/table/Empty"
import TableLoading from "@/components/table/TableLoading"
import { TransactionFilterCriteria } from "../../transactions/components/TransactionFilterModal"
import Loading from "@/components/ui/Loading"



// Client component receives id as a prop instead of params
interface UserDetailsClientProps {
    id: string
}

export default function UserDetailsClient({ id }: UserDetailsClientProps) {
    const [blockDialogOpen, setBlockDialogOpen] = useState<boolean>(false)


    const router = useRouter()

    const handleGoBack = () => {
        router.push("/dashboard/customers")
    }


    const handleSaveChanges = () => {
        alert("Changes saved successfully")
    }


    const {
        isLoading,
        customer,
        getCustomer,
        getWallet,
        wallets,
        isLoadingAction
    } = useCustomerStore()



    const {
        transactions,

        page,
        totalPages,
        isFilterResult,
        limit,
        filterData,
        isLoading: isTransactionLoading,
        setField,
        isQueryResult,
        getTransactions,
    } = useTransactionStore()


    const [selected, setSelected] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState("");
    const [action, setAction] = useState("");


    const handleFilterApply = (newFilters: Partial<TransactionFilterCriteria>) => {
        setField("filterData", newFilters);
        getTransactions({ page, limit, ...newFilters, user: id });

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

        getTransactions({ page, limit, user: id });

    };

    const handleSearchChange = () => {
        getTransactions({ page, limit, reference: searchValue, user: id });
    };

    const onResetSearch = () => {
        setSearchValue("");
        setField("isQueryResult", false);
        setField("filterData", null);
        setField("isFilterResult", false);
        setField("transactions", []);
        getTransactions({ page: 1, limit, user: id });
    };



    useEffect(() => {
        getCustomer(id)
        getWallet(id)
        // setField("filterData", {userId: id});
        getTransactions({
            page: 1,
            limit: 10, user: id
        })

    }, []);



    const initials = `${customer?.lastName[0] ?? ''}${customer?.firstName[0] ?? ''}`.toUpperCase();


    return (
        <>
            {isLoadingAction && <Loading />}

            {

                isLoading ? <DetailsLoading /> : <div className="container mx-auto p-4">
                    {/* Header */}
                    <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleGoBack}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-xl font-semibold">{customer?.lastName} {customer?.firstName}</h1>
                        </div>
                        <div className="flex flex-row gap-x-4">
                            {/* <button
                        className="justify-center items-center bg-white border border-green-500 text-green-500 font-medium px-4 py-2 rounded-[12px]"
                        onClick={handleResetPassword}
                    >
                        Reset Password
                    </button> */}

                            {customer?.status === "ACTIVE" ? (
                                <button
                                    className="justify-center items-center bg-[#FFEBEB] text-[#FF0000] font-medium px-4 py-2 rounded-[12px]"
                                    onClick={() => {
                                        setBlockDialogOpen(true)
                                        setAction("block")
                                    }}
                                >
                                    Block
                                </button>
                            ) : (
                                <button
                                    className="justify-center items-center bg-[#DDFF00] text-black font-medium px-4 py-2 rounded-[12px]"
                                    onClick={() => {
                                        setBlockDialogOpen(true)
                                        setAction("unblock")
                                    }}
                                >
                                    Unblock
                                </button>
                            )}

                        </div>
                    </div>

                    {/* User Info */}
                    <div className="bg-white rounded-lg mt-6 p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-primary overflow-hidden flex justify-center items-center" >

                                        <span className="font-bold ">{initials}</span>

                                    </div>
                                    {/* {userData.imageVerified && (
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
                            )} */}
                                </div>
                                <div>
                                    <div className="font-semibold">{customer?.lastName} {customer?.firstName}</div>
                                    <div className="text-sm text-gray-500">Tier {customer?.tier}   <span className={`px-4 py-1 inline-block text-xs font-medium  rounded-2xl ${customer?.status === "ACTIVE"
                                        ? "bg-[#1fc16b14] text-[#1fc16b]"
                                        : " bg-[#FFEBEB] text-[#FF0000]"

                                        }`}> {customer?.status ?? "N/A"}</span></div>
                                </div>
                            </div>
                            <button className="bg-[#DDFF00] text-black font-medium px-4 py-2 rounded-[12px]" onClick={handleSaveChanges}>
                                Save Changes
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">




                            <div>
                                <p className="text-gray-500 text-sm mb-1">Name</p>
                                <p className="font-medium">{customer?.lastName} {customer?.firstName} {customer?.middleName}</p>
                            </div>


                            <div>
                                <p className="text-gray-500 text-sm mb-1">Monitag</p>
                                <p className="font-medium">{customer?.monitag}</p>
                            </div>


                            <div>
                                <p className="text-gray-500 text-sm mb-1">Email</p>
                                <p className="font-medium">{maskData("email", customer?.email ?? "") || "N/A"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Phone</p>
                                <p className="font-medium">{maskData("phone", customer?.phone ?? "") || "N/A"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">gender</p>
                                <p className="font-medium">{customer?.gender ?? "N/A"}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Referral Code</p>
                                <p className="font-medium">{customer?.referralCode ?? "N/A"}</p>
                            </div>



                            <div>
                                <p className="text-gray-500 text-sm mb-1">NIN</p>
                                <p className="font-medium">{maskData("nin", customer?.nin ?? "") || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">BVN</p>
                                <p className="font-medium">{maskData("bvn", customer?.bvn ?? "") || "N/A"}</p>
                            </div>




                            {/* <div>
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
                    </div> */}

                        </div>
                    </div>

                    {/* Device Info */}
                    <div className="bg-white rounded-lg mt-6 p-6">
                        <h2 className="text-lg font-semibold mb-4">Wallet {wallets?.currencyCode} </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Available Balance</p>
                                <p className="font-medium">{formatAmount(wallets?.availableBalance ?? 0, true, true)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Current Balance</p>
                                <p className="font-medium">{formatAmount(wallets?.currentBalance ?? 0, true, true)}</p>
                            </div>

                        </div>
                    </div>



                    {/* Device Info */}
                    <div className="bg-white rounded-lg mt-6 p-6">
                        <h2 className="text-lg font-semibold mb-4">Address </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Name</p>
                                <p className="font-medium">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">OS</p>
                                <p className="font-medium">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">IP Address</p>
                                <p className="font-medium text-blue-500">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Location</p>
                                <p className="font-medium">{ }</p>
                            </div>
                        </div>
                    </div>

                    {/* Device Info */}
                    <div className="bg-white rounded-lg mt-6 p-6">
                        <h2 className="text-lg font-semibold mb-4">Date </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Registration Date</p>
                                <p className="font-medium">{formatedDate(customer?.createdAt)}</p>
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Updated Date</p>
                                <p className="font-medium">{formatedDate(customer?.updatedAt)}</p>
                            </div>


                            <div>
                                <p className="text-gray-500 text-sm mb-1">Last Login </p>
                                <p className="font-medium">{formatedDate(customer?.lastLogin)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Device Info */}
                    <div className="bg-white rounded-lg mt-6 p-6">
                        <h2 className="text-lg font-semibold mb-4">Device Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Name</p>
                                <p className="font-medium">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">OS</p>
                                <p className="font-medium">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">IP Address</p>
                                <p className="font-medium text-blue-500">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Location</p>
                                <p className="font-medium">{ }</p>
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
                                    { }
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Status Code</p>
                                <p className="font-medium">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Process Time</p>
                                <p className="font-medium">{ }</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm mb-1">Provider details</p>
                                <p className="font-medium">{ }</p>
                            </div>
                        </div>
                    </div>



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
                                onResetSearch={onResetSearch}
                                isSearchActive={isQueryResult} />

                            <div className="mx-4">
                                {isFilterResult && (
                                    <div className="flex items-center flex-wrap gap-4 mb-3">
                                        {filterData?.startDate && (
                                            <span className="bg-primary text-black  text-xs p-2 rounded-2xl font-light">
                                                From: {formatedDate(filterData.startDate.toDateString())}
                                            </span>
                                        )}
                                        {filterData?.endDate && (
                                            <span className="bg-primary text-black  text-xs p-2 rounded-2xl font-light">
                                                To:{formatedDate(filterData.endDate.toDateString())}
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
                                isTransactionLoading ? <TableLoading
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
                            isLoading={isTransactionLoading}
                            handleChangePerPage={onChangePage} />}



                        <FilterModal
                            isOpen={isFilterModalOpen}
                            onClose={() => setIsFilterModalOpen(false)}
                            onApply={handleFilterApply}
                        />
                    </>


                    <BlockUserDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen} action={action} user={id} />
                </div>
            }

        </>
    )
}

