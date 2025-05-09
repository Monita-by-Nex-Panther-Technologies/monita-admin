"use client"

import React, { useEffect } from 'react'
import TransactionsTable from './components/TransactionTable'
import TransactionStat from './components/TransactionStat'
import { useTransactionStore } from '@/store/transactionStore'
import PopupWrapper from '@/components/ui/popup-wrapper'

const page = () => {
     const {
        getTransactions,
        getTransactionStatistic,
        } = useTransactionStore()

        useEffect(() => {
            getTransactionStatistic()
            getTransactions({ page: 1, limit: 10 }); // Replace with appropriate values for TransactionQueryParams
          }, []);
                                    
    return (
        <div className=' w-full'>

      

            <TransactionStat />
            <TransactionsTable />
        </div>
    )
}

export default page
