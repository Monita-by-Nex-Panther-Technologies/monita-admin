
"use client"

import React from 'react'
import CashBackStat from './components/CashBackStat'
import CashbackRecipientsTable from './components/CashbackTable'

const page = () => {
    return (
        <div>
            <CashBackStat />
            <CashbackRecipientsTable />
        </div>
    )
}

export default page
