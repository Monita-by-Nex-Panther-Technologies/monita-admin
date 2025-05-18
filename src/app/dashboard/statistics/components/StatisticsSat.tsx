
"use client"
import StatCard from '@/components/common/StartCard'
import { useStatisticsStore } from '@/store/StatisricStore'
// import { useStatisticsStore } from '@/stores/statisticsStore'
import { formatAmount, formatNumber } from '@/utilities/utils'
import { BanknoteArrowUp, Calculator, CircleDollarSign, CreditCard } from 'lucide-react'
import { useEffect } from 'react'

const StatisticsSat = () => {
    const { 
      statisticsdataBlock,
      isLoadingStatsBlock,
      getStatisticsBlock,
      queryType
    } = useStatisticsStore();
    
    useEffect(() => {
      // Fetch statistics when component mounts or queryType changes
      getStatisticsBlock({ queryType });
    }, [queryType]);
    
    return (
        <div className='grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 gap-4'>
          <StatCard
                title="Total"
              value={formatNumber(statisticsdataBlock?.total|| 0)}
                // value={formatNumber(statisticsdataBlock?.total|| 0)}
                Icon={<Calculator className="w-4 h-4 md:w-6 md:h-6" />}
                loading={isLoadingStatsBlock}
            />

            <StatCard
                title="Credit"
                 value={formatAmount(statisticsdataBlock?.creditAmount|| 0,true,true)}
                
                Icon={<BanknoteArrowUp className="w-4 h-4 md:w-6 md:h-6" />}
                loading={isLoadingStatsBlock}
            />

            <StatCard
                title="Debit"
              
                value={formatAmount(statisticsdataBlock?.debitAmount|| 0,true,true)}
                Icon={<CreditCard className="w-4 h-4 md:w-6 md:h-6" />}
                loading={isLoadingStatsBlock}
            />

            <StatCard
                title="Net"
                value={formatAmount(statisticsdataBlock?.net|| 0,true,true)}
                Icon={<CircleDollarSign className="w-4 h-4 md:w-6 md:h-6" />}
                loading={isLoadingStatsBlock}
            />
        </div>
    )
}

export default StatisticsSat
// "use client"
// import StatCard from '@/components/common/StartCard'
// import { icons } from '@/constants/icons'
// import { formatAmount, formatNumber } from '@/utilities/utils'
// import { BanknoteArrowUp, Calculator, CircleDollarSign, CreditCard } from 'lucide-react'
// import React from 'react'

// const StatisticsSat = () => {
    

//     const isLoading = false;
//     const statistic:any = null

//     return (
//         <div className=' grid xl:grid-col-4 lg:grid-cols-4 md:grid-cols-2 gap-4'>
//           <StatCard
//                 title="Total"
//                 value={formatNumber(statistic?.total|| 0)}
//                 Icon={ <Calculator className="w-4 h-4 md:w-6 md:h-6" />} // Pass the icon component directly
//                 loading={isLoading}
//             />


//             <StatCard
//                 title="Revenue"
//                 value={formatAmount(statistic?.revenue|| 0,true,true)}
//                 Icon={ <BanknoteArrowUp className="w-4 h-4 md:w-6 md:h-6" />} 
//                 loading={isLoading}
//             />

//                <StatCard
//                 title="Deposit"
//                 value={formatAmount(statistic?.deposits|| 0,true,true)}
//                 Icon={ <CreditCard className="w-4 h-4 md:w-6 md:h-6" />} 
//                 loading={isLoading}
//             />

//             <StatCard
//                 title="Profit"
//                 value={formatAmount(statistic?.profit|| 0,true,true)}
//                 Icon={ <CircleDollarSign className="w-4 h-4 md:w-6 md:h-6" />} 
//                 loading={isLoading}
//             />


//         </div>
//     )
// }

// export default StatisticsSat
