import React from 'react';
import Image from "next/image";
import { TvIcon } from 'lucide-react';

// Define the props for the StatCard component
interface StatCardProps {
    title: string;
    value: string | number;
    Icon: any;
    loading?: boolean;  // Add loading state prop
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon, loading = false }) => {
    return (
        <div className="bg-white rounded-lg px-4 py-6 flex flex-col">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className={`text-xs text-text-body font-normal font-poppins ${loading ? "bg-gray-200 h-4 w-24 animate-pulse" : ""}`}>
                        {loading ? "" : title}
                    </p>
                    <h2 className={`text-lg md:text-lg font-semibold font-poppins mt-1 ${loading ? "bg-gray-200 h-6 w-20 animate-pulse" : ""}`}>
                        {loading ? "" : value}
                    </h2>
                </div>
                <div className={`bg-primary p-2 rounded-full ${loading ? "bg-background w-8 h-8 animate-pulse" : " "}`}>
                    {loading ? (
                       <></>// Placeholder for icon
                    ) : Icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
