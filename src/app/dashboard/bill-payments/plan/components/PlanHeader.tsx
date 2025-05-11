'use client'

import { ServiceType, useServiceStore } from '@/store/BillpaymentStore';
import { Database, Globe, Tv } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
        // Clear cached data and set the selected service before navigation
        onServiceSelect(serviceType, serviceId);
    };

    return (
        <Link href={route} className="block w-full" onClick={handleClick}>
            <div
                className={`
                    p-3 sm:p-4 rounded-lg cursor-pointer transition-all duration-200 
                    flex flex-row items-center justify-start gap-2
                    ${isActive
                        ? 'bg-white border-2 border-primary'
                        : 'bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm'
                    }
                `}
            >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex justify-center items-center ${isActive ? 'bg-white' : 'bg-background-alt'}`}>
                    <div className="text-gray-700">
                        {icon}
                    </div>
                </div>
                <span className="text-[14px] sm:text-[16px] font-poppins font-normal text-gray-700 truncate">{label}</span>
            </div>
        </Link>
    );
};

const PlanHeader = () => {
    const pathname = usePathname();
    const router = useRouter();
    const basePath = "/dashboard/bill-payments/plan";

    const {
        services,
        getServices,
        isLoading,
        setSelectedService,
        // clearBrands
    } = useServiceStore();

    const [serviceMap, setServiceMap] = useState<Record<string, string>>({});

    // Fetch services when component mounts
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

    // Create service map for lookup
    useEffect(() => {
        const map: Record<string, string> = {};
        services.forEach(service => {
            map[service.label.toLowerCase()] = service.id;
        });
        setServiceMap(map);
    }, [services]);

    const categories = [
        {
            id: 'data' as ServiceType,
            label: 'Data Plan',
            icon: <Database size={20} />,
            route: `${basePath}/data-plan`,
            lookupKey: 'data'
        },
        {
            id: 'internet' as ServiceType,
            label: 'Internet',
            icon: <Globe size={20} />,
            route: `${basePath}/internet`,
            lookupKey: 'internet'
        },
        {
            id: 'cable' as ServiceType,
            label: 'Cable TV',
            icon: <Tv size={20} />,
            route: `${basePath}/cable`,
            lookupKey: 'cable'
        },
        {
            id: 'giftcard' as ServiceType,
            label: 'GiftCards',
            route: `${basePath}/giftcard`,
            lookupKey: 'giftcard',
            icon: <Database size={20} />
        },
    ];

    const handleServiceSelect = (serviceType: ServiceType, serviceId: string) => {
        console.log("Selected Service Type:", serviceType);
        console.log("Selected Service ID:", serviceId);

        // Clear any cached brands before setting new service
        // clearBrands();

        // Set the selected service
        setSelectedService(serviceType, serviceId);
    };

    return (
        <div className='w-full flex flex-col sm:flex-row justify-between items-center bg-background p-3 sm:p-4 rounded-[8px] mt-4'>
            {categories.map((category) => (
                <div key={category.id} className='w-full sm:w-[23%] px-2 sm:px-3 py-2'>
                    <ProductNavItem
                        icon={category.icon}
                        label={category.label}
                        route={category.route}
                        isActive={pathname === category.route || pathname.startsWith(`${category.route}/`)}
                        serviceId={serviceMap[category.lookupKey] || ''}
                        serviceType={category.id}
                        onServiceSelect={handleServiceSelect}
                    />
                </div>
            ))}
        </div>
    )
}

export default PlanHeader
