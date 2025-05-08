"use client"
import React from 'react'
import KycApplicationsTable from './components/kycApplication'
import TransactionStat from '../transactions/components/TransactionStat'

const page = () => {
    return (
        <div>
            <TransactionStat />
            <KycApplicationsTable />
        </div>
    )
}

export default page
