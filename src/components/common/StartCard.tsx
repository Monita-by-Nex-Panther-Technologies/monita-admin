import React from 'react';

// Define the props for the StatCard component
interface StatCardProps {
    title: string;
    value: string | number;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Type for the SVG icon component
}

const StatCard: React.FC<StatCardProps> = ({ title, value, Icon }) => {
    return (
        <div className="bg-white rounded-lg p-6 flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-text-body font-normal font-poppins">{title}</p>
                    <h2 className="text-2xl font-semibold font-poppins mt-1">{value}</h2>
                </div>
                <div className="bg-background-alt p-2 rounded-full">
                    <Icon className="text-text-body" /> {/* Render the icon as a component */}
                </div>
            </div>
        </div>
    );
};

export default StatCard;