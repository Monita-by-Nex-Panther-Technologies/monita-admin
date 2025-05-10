'use client';

import { ServiceType, useServiceStore } from '@/store/BillpaymentStore';
import {
    Database,
    Gift,
    Globe,
    GraduationCap,
    Lightbulb,
    Phone,
    Smartphone,
    Tv
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ProductNavItemProps {
    icon: React.ReactNode;
    label: string;
    route: string;
    isActive: boolean;
    serviceId: string;
    serviceType: ServiceType;
    onServiceSelect: (serviceType: ServiceType, serviceId: string) => void;
}

const ProductNavItem: React.FC<ProductNavItemProps> = ({
    icon,
    label,
    route,
    isActive,
    serviceId,
    serviceType,
    onServiceSelect
}) => {
    const handleClick = (e: React.MouseEvent) => {
        // Set the selected service before navigation
        onServiceSelect(serviceType, serviceId);
    };

    return (
        <Link href={`${route}`} className="block" onClick={handleClick}>
            <div
                className={`
                    p-4 rounded-lg cursor-pointer transition-all duration-200 flex flex-row items-center justify-start gap-2
                    ${isActive ? 'bg-lime-100 border border-lime-400' : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'}
                `}
            >
                <div className='w-10 h-10 rounded-full bg-background-alt flex justify-center items-center'>
                    <div className="text-gray-700">
                        {icon}
                    </div>
                </div>
                <span className="text-[16px] font-poppins font-normal text-gray-700">{label}</span>
            </div>
        </Link>
    );
};

// Skeleton loading component for ProductNavItem
const ProductNavItemSkeleton = () => {
    return (
        <div className="block">
            <div className="p-4 rounded-lg border border-gray-100 bg-white">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

interface ProductNavSectionProps {
    basePath?: string;
}

const ProductNavSection: React.FC<ProductNavSectionProps> = ({
    basePath = '/dashboard/bill-payments/products'
}) => {
    const pathname = usePathname();
    const { services, getServices, isLoading, setSelectedService } = useServiceStore();
    const [serviceMap, setServiceMap] = useState<Record<string, string>>({});


    useEffect(() => {
        const fetchServices = async () => {
            try {
                getServices();
            } catch (error: any) {
                toast.error("Failed to load services", {
                    description: error.message || "An error occurred"
                });
            }
        };

        fetchServices();
    }, [getServices]);

    useEffect(() => {
        // Create a map of label to service ID for easy lookup
        const map: Record<string, string> = {};
        services.forEach(service => {
            map[service.label.toLowerCase()] = service.id;
        });
        setServiceMap(map);
    }, [services]);

    // Icon mapping
    const getIcon = (id: string) => {
        switch (id) {
            case 'airtime': return <Phone size={20} />;
            case 'data': return <Database size={20} />;
            case 'cable': return <Tv size={20} />;
            case 'education': return <GraduationCap size={20} />;
            case 'internet': return <Globe size={20} />;
            case 'electricity': return <Lightbulb size={20} />;
            case 'esim': return <Smartphone size={20} />;
            case 'giftcard': return <Gift size={20} />;
            default: return <Phone size={20} />;
        }
    };

    // Define categories based on actual service data
    const categories = [
        {
            id: 'airtime' as ServiceType,
            label: 'Airtime',
            route: `${basePath}/airtime`,
            lookupKey: 'airtime'
        },
        {
            id: 'data' as ServiceType,
            label: 'Data Plan',
            route: `${basePath}/data`,
            lookupKey: 'data'
        },
        {
            id: 'cable' as ServiceType,
            label: 'Cable TV',
            route: `${basePath}/cable`,
            lookupKey: 'cable'
        },
        {
            id: 'education' as ServiceType,
            label: 'Education',
            route: `${basePath}/education`,
            lookupKey: 'education'
        },
        {
            id: 'internet' as ServiceType,
            label: 'Internet',
            route: `${basePath}/internet`,
            lookupKey: 'internet'
        },
        {
            id: 'electricity' as ServiceType,
            label: 'Electricity',
            route: `${basePath}/electricity`,
            lookupKey: 'electricity'
        },
        {
            id: 'esim' as ServiceType,
            label: 'eSIMs',
            route: `${basePath}/esims`,
            lookupKey: 'esim'
        },
        {
            id: 'giftcard' as ServiceType,
            label: 'GiftCards',
            route: `${basePath}/giftcard`,
            lookupKey: 'giftcard'
        },
    ];

    const handleServiceSelect = (serviceType: ServiceType, serviceId: string) => {

        console.log("Selected Service Type:", serviceType);
        console.log("Selected Service ID:", serviceId);


        setSelectedService(serviceType, serviceId);
    };

    return (
        <div className="w-full my-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {isLoading ? (
                    // Show skeleton loaders while loading
                    Array(8).fill(0).map((_, index) => (
                        <ProductNavItemSkeleton key={index} />
                    ))
                ) : (
                    // Show actual items when loaded
                    categories.map((category) => (
                        <ProductNavItem
                            key={category.id}
                            icon={getIcon(category.id)}
                            label={category.label}
                            route={category.route}
                            isActive={pathname === category.route || pathname.startsWith(`${category.route}/`)}
                            serviceId={serviceMap[category.lookupKey] || ''}
                            serviceType={category.id}
                            onServiceSelect={handleServiceSelect}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductNavSection;