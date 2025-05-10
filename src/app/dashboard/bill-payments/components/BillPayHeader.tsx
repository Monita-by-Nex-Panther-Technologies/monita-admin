'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BillPayHeader = () => {
    const pathname = usePathname();

    const isPathActive = (basePath: string) => {
        return pathname.startsWith(basePath);
    };

    return (
        <div className='w-full flex flex-col sm:flex-row justify-between items-center bg-background p-4 rounded-[8px] gap-4'>
            <h1 className='text-text-title text-xl font-semibold font-poppins'>
                Service Management
            </h1>
            <div className='flex flex-col sm:flex-row w-full sm:w-auto bg-background-alt gap-2 sm:gap-x-1.5 px-3 py-2 rounded-[8px]'>
                <Link
                    href="/dashboard/bill-payments/service-type"
                    className={`cursor-pointer flex justify-center items-center bg-background text-text-body font-poppins px-4 py-3 w-full sm:w-[186px] rounded-[8px] text-center ${isPathActive("/dashboard/bill-payments/service-type")
                        ? "bg-primary-alpha-8 border-2 border-primary text-text-title"
                        : ""
                        }`}
                >
                    Services
                </Link>
                <Link
                    href="/dashboard/bill-payments/products/airtime"
                    className={`cursor-pointer flex justify-center items-center bg-background text-text-body font-poppins px-4 py-3 w-full sm:w-[186px] rounded-[8px] text-center ${isPathActive("/dashboard/bill-payments/products")
                        ? "bg-primary-alpha-8 border-2 border-primary text-text-title"
                        : ""
                        }`}
                >
                    Brands
                </Link>
                <Link
                    href="/dashboard/bill-payments/plan/data-plan"
                    className={`cursor-pointer flex justify-center items-center bg-background text-text-body font-poppins px-4 py-3 w-full sm:w-[186px] rounded-[8px] text-center ${isPathActive("/dashboard/bill-payments/plan")
                        ? "bg-primary-alpha-8 border-2 border-primary text-text-title"
                        : ""
                        }`}
                >
                    Products
                </Link>
            </div>
        </div>
    )
}

export default BillPayHeader