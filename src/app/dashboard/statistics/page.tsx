"use client";
import { useStatisticsStore } from '@/store/StatisricStore';
import { useEffect } from 'react';
import StatisticsDash from './components/StatisticsDash';
import StatisticsSat from './components/StatisticsSat';

const page = () => {
    const {
        getStatisticsBlock,

        queryType
    } = useStatisticsStore();
    useEffect(() => {
        getStatisticsBlock({ queryType });
    }, []);
    return (
        <div>
            <StatisticsSat />
            <StatisticsDash />

        </div>
    )
}

export default page
