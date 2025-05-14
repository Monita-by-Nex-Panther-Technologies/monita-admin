"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { useTransactionStore } from "@/store/transactionStore"
import DetailsLoading from "@/components/ui/DetailsLoading"
import { formatAmount, formatedDate } from "@/utilities/utils"
import { toast } from "sonner"
import Spinner from "@/components/ui/spinner"

// Client component receives id as a prop instead of params
interface TransactionDetailsClientProps {
    id: string
}

export default function TransactionDetailsClient({ id }: TransactionDetailsClientProps) {
  
    const router = useRouter()

     const {
        isLoading,
        transaction,
            getTransaction,
            } = useTransactionStore()
    
useEffect(() => {
    getTransaction(id)
    }, []);

            
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard: " + text);
    };

    return (
<>
      
 
     { isLoading ? <DetailsLoading/> :

        <div className="container mx-auto p-4 scroll-auto">
            {/* Header */}
            <div className="w-full flex flex-row justify-between items-center bg-background p-2 md:p-4 rounded-[8px]">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={()=>router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-semibold hidden md:block">Transaction Details</h1>
                </div>
                <div className="flex flex-row gap-x-4">
                <button className="bg-primary text-black font-medium px-4 py-2 rounded-[12px] text-xs md:text-lg" onClick={() => {}}>
                      Generate Receipt
                    </button>
                </div>
            </div>

            {/* Transaction Info */}
            <div className="bg-white rounded-lg mt-6 p-6">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                                <Image
                                    src="/placeholder.svg"
                                    alt={""}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                           
                        </div>
                        <div className="flex flex-col gap-0">
                            <div className="font-semibold text-sm md:text-lg">{transaction?.desc}</div>
                            <div className=" text-gray-500 text-xs md:text-md">{transaction?.reference}

                                <Button variant="ghost" size="sm" onClick={() =>  copyToClipboard(transaction?.reference ?? "")}>
                                                            <Copy className="w-4 h-4" />
                                                        </Button>
                            </div>
                        </div>
                    </div>
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                

                <div>
                        <p className="text-gray-500 text-sm mb-1">Type</p>
                        <p className="font-medium"> {transaction?.type}</p>
                    </div>


                    <div>
                        <p className="text-gray-500 text-sm mb-1">Amount</p>
                        <p className="font-medium"> {formatAmount(transaction?.amount ?? 0, true, true)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Paid</p>
                        <p className="font-medium"> {formatAmount(transaction?.totalAmount ?? 0, true, true)}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm mb-1">Fee</p>
                        <p className="font-medium"> {formatAmount(transaction?.fee ?? 0, true, true)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Product</p>
                        <p className="font-medium"> {transaction?.product}</p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm mb-1">category</p>
                        <p className="font-medium"> {transaction?.category ?? "N/A" }</p>
                    </div>


                    <div>
                        <p className="text-gray-500 text-sm mb-1">Beneficiary</p>
                        <p className="font-medium"> {transaction?.beneficiary ?? "N/A" }</p>
                    </div>



                    <div>
                        <p className="text-gray-500 text-sm mb-1">Status</p>

                           <p className={`px-4 py-1 inline-block text-xs font-medium  rounded-2xl ${
                                transaction?.status === "SUCCESS"
                                    ? "bg-[#1fc16b14] text-[#1fc16b]"
                                    : transaction?.status === "FAILED"
                                    ? " bg-[#FFEBEB] text-[#FF0000]"
                                    : "status-pending"
                            }`}> {transaction?.status ?? "N/A" }</p>
                    </div>


                </div>

            </div>

            <div className="bg-white rounded-lg mt-6 p-6">
                <h2 className="text-lg font-semibold mb-4">TimeStamps </h2>
                <div className=""></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Created At</p>
                        <p className="font-medium">{formatedDate(transaction?.createdAt)  }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Updated At</p>
                        <p className="font-medium">{formatedDate(transaction?.updatedAt) }</p>
                    </div>
                  
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Completed At</p>
                        <p className="font-medium">{formatedDate(transaction?.completedAt) }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Faied At</p>
                        <p className="font-medium">{formatedDate(transaction?.failedAt ?? undefined)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg mt-6 p-6">
                <h2 className="text-lg font-semibold mb-4">Customer Info</h2>
                <div className=""></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Name</p>
                        <p className="font-medium">{"MUSA"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Email</p>
                        <p className="font-medium">{"BABALOLA"}</p>
                    </div>
                  

                    <div>
                        <p className="text-gray-500 text-sm mb-1">Pre Balance </p>
                        <p className={`font-medium ${(transaction?.previousBalance ?? 0) > (transaction?.newBalance ?? 0) && "text-red-400" }`}> {formatAmount(transaction?.previousBalance ?? 0, true, true)}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Net Balance</p>
                        <p className={`font-medium ${(transaction?.newBalance ?? 0) > (transaction?.previousBalance ?? 0) && "text-green-400" }`}> {formatAmount(transaction?.newBalance ?? 0, true, true)}</p>
                    </div>
                </div>
            </div>

            

            {/* Device Info */}
            <div className="bg-white rounded-lg mt-6 p-6">
                <h2 className="text-lg font-semibold mb-4">Device Info</h2>
                <div className=""></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Name</p>
                        <p className="font-medium">{"IPHONE"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">OS</p>
                        <p className="font-medium">{"IOS"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">IP Address</p>
                        <p className="font-medium text-blue-500">{"171.43.32.2"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Location</p>
                        <p className="font-medium">{"Lago/Nigeriaß"}</p>
                    </div>
                </div>
            </div>

            {/* Other Details */}

            {
                transaction?.metadata &&  <div className="bg-white rounded-lg mt-6 p-6">
                <h2 className="text-lg font-semibold mb-4">Other Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {Object.entries(transaction?.metadata ?? {}).map(([key, value]) => (

                    <div  key={key} >
                    <p className="text-gray-500 text-sm mb-1">{key}</p>
                    <p className="font-medium">  {value}</p>
                    </div>

                        ))}


                   
                </div>
            </div>

            }
           
          

            {/* <BlockTransactionDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen} /> */}
        </div>
}
        </>

    )
}

