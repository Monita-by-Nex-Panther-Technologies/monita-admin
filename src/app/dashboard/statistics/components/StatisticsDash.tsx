"use client"

import { ChartType, useStatisticsStore } from "@/store/StatisricStore"
import { useEffect, useState } from "react"
import {
    Area,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ComposedChart,
    Legend,
    Line,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import StatFilterModal from "./statsFilter"



const transactionTypesData = [
    { name: "Airtime", value: 20, color: "#FF5733" },
    { name: "Data", value: 15, color: "#0088FE" },
    { name: "Cable TV", value: 15, color: "#FF4560" },
    { name: "Electricity", value: 10, color: "#00C49F" },
    { name: "GiftCards", value: 10, color: "#FFBB28" },
    { name: "eSIMS", value: 10, color: "#AF19FF" },
    { name: "Education", value: 10, color: "#4ECDC4" },
    { name: "Internet", value: 10, color: "#7B68EE" },
]

const userDemographicsData = [
    { name: "Lagos: 40%", value: 40, color: "#2D3748" },
    { name: "Abuja: 20%", value: 20, color: "#0088FE" },
    { name: "Ibadan: 20%", value: 20, color: "#FF4560" },
    { name: "Benin: 10%", value: 10, color: "#00C49F" },
    { name: "Ekiti: 10%", value: 10, color: "#FFBB28" },
]

export default function StatisticsDash() {
    const {
        queryType,
        isLoadingCharts,
        userGrowth,
        chartType,
        transactionVolume,
        isLoadingDemographics,
        getUserDemographicsData,
        userDemographics,
        setField,
        getUserGrowthData,
        initializeAllData,
        getStatisticsBlock,
        getTransactionVolumeData
    } = useStatisticsStore();
    const [activeTab, setActiveTab] = useState("Transaction Volume")
    const handleQueryTypeChange = (newQueryType: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom',newChartType:'volume'|'trend') => {
        if (newQueryType === 'custom') {
            setIsFilterModalOpen(true);
            return;
        }
        setField('queryType', newQueryType);

        setField('chartType', newChartType);
        getStatisticsBlock({ queryType: newQueryType });
        getTransactionVolumeData({ queryType, chartType });
        getUserGrowthData({ queryType: newQueryType });
        getUserDemographicsData({ queryType: newQueryType });

    };
     useEffect(() => {
        initializeAllData();
    }, []); 


    // useEffect(() => {
    //     getTransactionVolumeData({ queryType, chartType });
    //     getTransactionVolumeData({ queryType, chartType });
    //     getUserDemographicsData({ queryType });
    //     getUserGrowthData({ queryType });
    // }, []);

    // Handle tab change for volume/trend
    const handleTabChange = (newChartType: ChartType) => {
        setField('chartType', newChartType);
        getTransactionVolumeData({ queryType, chartType });
    };

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);


    // Calculate domain for Y axis based on data
    const maxValue = transactionVolume.length > 0
        ? Math.max(...transactionVolume.map(item => item.value)) * 1.2
        : 500000;

    const minValue = transactionVolume.length > 0
        ? Math.min(Math.min(...transactionVolume.map(item => item.value)) * 0.8, 100000)
        : 0;

    // Generate ticks based on min and max values
    const generateYAxisTicks = () => {
        const range = maxValue - minValue;
        const step = Math.ceil(range / 5);
        const ticks = [];

        for (let i = 0; i <= 5; i++) {
            ticks.push(Math.round(minValue + step * i));
        }

        return ticks;
    };

    const handleFilterApply = ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
        // Set queryType to custom
        setField('queryType', 'custom');

        // Update date range and fetch new data
        if (startDate || endDate) {
            // Update charts with custom date range
            getStatisticsBlock({ queryType: 'custom', startDate, endDate });
            getTransactionVolumeData({ queryType: 'custom', chartType, startDate, endDate });
            getUserGrowthData({ queryType: 'custom', startDate, endDate });

            // Store the date range
            if (startDate) setField('startDate', startDate);
            if (endDate) setField('endDate', endDate);
        }
    };
    const demographicsTotal = userDemographics && userDemographics.length > 0
        ? userDemographics.reduce((sum, item) => sum + item.value, 0)
        : 0;


    return (
        <div className="mt-4">
            <div className="flex flex-col gap-4 ">

                <div className="w-full flex flex-col md:flex-row justify-between items-center bg-background p-4 rounded-[8px] gap-4">
                    <h1 className="text-text-title text-xl font-semibold font-poppins">Filter by Date</h1>
                    <div className="flex flex-col sm:flex-row w-full md:w-auto bg-background-alt gap-2 sm:gap-x-1.5 p-2 rounded-[8px]">
                        <button
                            className={`justify-center items-center ${queryType === 'daily' ? 'bg-primary-light border border-primary' : 'bg-background'} text-text-body font-poppins px-4 py-2 w-full sm:w-[120px] md:w-[150px] lg:w-[186px] rounded-[8px]`}
                            onClick={() => handleQueryTypeChange('daily',chartType)}
                        >
                            Daily
                        </button>
                        <button
                            className={`justify-center items-center ${queryType === 'weekly' ? 'bg-primary-light border border-primary' : 'bg-background'} text-text-body font-poppins px-4 py-2 w-full sm:w-[120px] md:w-[150px] lg:w-[186px] rounded-[8px]`}
                            onClick={() => handleQueryTypeChange('weekly',chartType)}
                        >
                            Weekly
                        </button>

                        <button
                            className={`justify-center items-center ${queryType === 'monthly' ? 'bg-primary-light border border-primary' : 'bg-background'} text-text-body font-poppins px-4 py-2 w-full sm:w-[120px] md:w-[150px] lg:w-[186px] rounded-[8px]`}
                            onClick={() => handleQueryTypeChange('monthly',chartType)}
                        >
                            Monthly
                        </button>
                        <button
                            className={`justify-center items-center ${queryType === 'yearly' ? 'bg-primary-light border border-primary' : 'bg-background'} text-text-body font-poppins px-4 py-2 w-full sm:w-[120px] md:w-[150px] lg:w-[186px] rounded-[8px]`}
                            onClick={() => handleQueryTypeChange('yearly',chartType)}
                        >
                            Yearly
                        </button>
                        <button
                            className={`justify-center items-center ${queryType === 'custom' ? 'bg-primary-light border border-primary' : 'bg-background'} text-text-body font-poppins px-4 py-2 w-full sm:w-[120px] md:w-[150px] lg:w-[162px] rounded-[8px]`}
                            onClick={() => handleQueryTypeChange('custom',chartType)}
                        >
                            Custom
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                    <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
                        <div className="w-full flex flex-row justify-between items-center mb-4">
                            {/* <h1 className="text-text-title text-xl font-semibold font-poppins">Volume & Trends</h1> */}
                            <div className="flex flex-row bg-background-alt gap-x-1.5 px-3 py-2 rounded-[8px]">
                                <button
                                    className={`justify-center items-center ${chartType === 'volume' ? 'bg-primary-light border border-primary' : 'bg-background'} text-text-body font-poppins px-4 py-2 rounded-[8px]`}
                                    onClick={() => handleTabChange('volume')}
                                >
                                    Transaction Volume
                                </button>
                                <button
                                    className={`justify-center items-center ${chartType === 'trend' ? 'bg-primary-light border border-primary' : 'bg-background'} text-text-body font-poppins px-4 py-2 rounded-[8px]`}
                                    onClick={() => handleTabChange('trend')}
                                >
                                    Transaction Trends
                                </button>
                            </div>
                        </div>
                        <div className="mt-6">
                            <div className="font-medium text-text-title mb-4 font-poppins">
                                {chartType === 'volume' ? 'Transaction Volume' : 'Transaction Trends'}
                            </div>

                            {isLoadingCharts ? (

                                <div className="h-64 flex flex-col justify-center items-center space-y-4">
                                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-full h-36 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-full flex justify-center space-x-4">
                                        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={transactionVolume} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="verticalGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#FFDE00" stopOpacity="0.32" />
                                                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.04" />
                                                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(value) => `${value >= 1000 ? value / 1000 + 'k' : value}`}
                                                domain={[minValue, maxValue]}
                                                ticks={generateYAxisTicks()}
                                            />
                                            <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
                                            <Area type="monotone" dataKey="value" fill="url(#verticalGradient)" stroke="none" />
                                            <Line
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#FFDE00"
                                                strokeWidth={2}
                                                dot={{ r: 4, fill: "#FFDE00", strokeWidth: 0 }}
                                                activeDot={{ r: 6, fill: "#FFDE00", strokeWidth: 0 }}
                                            />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="mb-2 font-medium text-text-title font-poppins">Transaction Types</div>
                        <div className="h-64 flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={transactionTypesData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {transactionTypesData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value) => <span className="text-text-body font-poppins">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
                        <div className="mb-2 font-medium text-text-title font-poppins">User Growth</div>

                        {isLoadingCharts ? (
                            // Skeleton loading
                            <div className="h-64 flex flex-col justify-center items-center space-y-4">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full h-36 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full flex justify-center space-x-4">
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ) : userGrowth && userGrowth.length > 0 ? (
                            // Chart with data
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={userGrowth}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        barGap={0}
                                        barCategoryGap={8}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) => `${value >= 1000 ? (value / 1000) : value}`}
                                            domain={[0, 'auto']}
                                        />
                                        <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
                                        <Legend
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => <span className="text-text-body font-poppins capitalize">{value}</span>}
                                        />
                                        <Bar dataKey="active" fill="#5F8D4E" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="inactive" fill="#A4BE7B" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            // No data state
                            <div className="h-64 flex justify-center items-center">
                                <p className="text-gray-500">No user growth data available</p>
                            </div>
                        )}
                    </div>


                    {/* <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="mb-2 font-medium text-text-title font-poppins">User Demographics</div>
                        <div className="h-64 flex justify-center items-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userDemographicsData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {userDemographicsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <text
                                        x="32%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="font-poppins font-medium"
                                    >
                                        100%
                                    </text>
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(value) => <span className="text-text-body font-poppins">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div> */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="mb-2 font-medium text-text-title font-poppins">User Demographics</div>
                        {isLoadingDemographics ? (
                            <div className="h-64 flex flex-col justify-center items-center space-y-4">
                                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full h-36 bg-gray-200 rounded animate-pulse"></div>
                                <div className="w-full flex justify-center space-x-4">
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ) : userDemographics && userDemographics.length > 0 ? (
                            <div className="h-64 flex justify-center items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={userDemographics}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={30}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {userDemographics.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <text
                                            x="32%"
                                            y="50%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="font-poppins font-medium"
                                        >
                                            {demographicsTotal}%
                                        </text>
                                        <Legend
                                            layout="vertical"
                                            verticalAlign="middle"
                                            align="right"
                                            iconType="circle"
                                            iconSize={8}
                                            formatter={(value) => <span className="text-text-body font-poppins">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-64 flex justify-center items-center">
                                <p className="text-gray-500">No user demographics data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <StatFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
            />
        </div>
    )
}

