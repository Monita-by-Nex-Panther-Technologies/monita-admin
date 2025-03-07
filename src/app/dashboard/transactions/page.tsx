import React from 'react'
import TransactionsTable from './components/TransactionTable'
import TransactionStat from './components/TransactionStat'

const page = () => {
    return (
        <div className=' w-full'>
            <TransactionStat />
            <TransactionsTable />
        </div>
    )
}

export default page
