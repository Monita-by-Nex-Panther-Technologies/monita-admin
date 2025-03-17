'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Phone,
    Database,
    Tv,
    GraduationCap,
    Globe,
    Lightbulb,
    Smartphone,
    Gift
} from 'lucide-react';

interface ProductNavItemProps {
    icon: React.ReactNode;
    label: string;
    route: string;
    isActive: boolean;
}

const ProductNavItem: React.FC<ProductNavItemProps> = ({
    icon,
    label,
    route,
    isActive
}) => {
    return (
        <Link href={route} className="block">
            <div
                className={`
          p-4 rounded-lg cursor-pointer transition-all duration-200 flex flex-row items-center justify-start gap-2
          ${isActive ? 'bg-lime-100 border border-lime-400' : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'}
        `}
            >
                <div className=' w-10 h-10 rounded-full bg-background-alt flex justify-center items-center'>

                    <div className="text-gray-700">
                        {icon}
                    </div>
                </div>
                <span className="text-[16px] font-poppins font-normal text-gray-700">{label}</span>
            </div>
        </Link>
    );
};

interface ProductNavSectionProps {
    basePath?: string;
}

const ProductNavSection: React.FC<ProductNavSectionProps> = ({
    basePath = '/dashboard/bill-payments/products'
}) => {
    const pathname = usePathname();

    const categories = [
        { id: 'airtime', label: 'Airtime', icon: <Phone size={20} />, route: `${basePath}/airtime` },
        { id: 'data', label: 'Data Plan', icon: <Database size={20} />, route: `/dashboard/bill-payments/plan/data-plan` },
        { id: 'cable', label: 'Cable TV', icon: <Tv size={20} />, route: `${basePath}/cable` },
        { id: 'education', label: 'Education', icon: <GraduationCap size={20} />, route: `${basePath}/education` },
        { id: 'internet', label: 'Internet', icon: <Globe size={20} />, route: `${basePath}/internet` },
        { id: 'electricity', label: 'Electricity', icon: <Lightbulb size={20} />, route: `${basePath}/electricity` },
        { id: 'esims', label: 'eSIMs', icon: <Smartphone size={20} />, route: `${basePath}/esims` },
        { id: 'giftcards', label: 'GiftCards', icon: <Gift size={20} />, route: `${basePath}/giftcards` },
    ];

    return (
        <div className="w-full  my-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <ProductNavItem
                        key={category.id}
                        icon={category.icon}
                        label={category.label}
                        route={category.route}
                        isActive={pathname === category.route || pathname.startsWith(`${category.route}/`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductNavSection;