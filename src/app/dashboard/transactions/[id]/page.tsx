"use client"

import { useTransactionStore } from "@/store/transactionStore";
import TransactionDetailsClient from "./transaction-details-client"
import { useEffect } from "react";

// Make the page component async to handle the Promise-based params
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    // Await the params to get the actual values
    const resolvedParams = await params

   
    // Pass the id to the client component
    return <TransactionDetailsClient id={resolvedParams.id} />
}
