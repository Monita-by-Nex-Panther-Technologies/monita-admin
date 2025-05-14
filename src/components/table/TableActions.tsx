import React, { useRef } from "react";
import { ListFilter, Search, X } from "lucide-react";
import Image from "next/image";
import { icons } from "@/constants/icons";


interface TableActionsProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearch:  (value: string) => void;
    onResetSearch: () => void;
    isSearchActive: boolean;
    areFiltersActive: boolean;
    onFilterClick: () => void;
    onResetFilters: () => void;
    showExport?: boolean; 
    exportOptions?: { label: string; format: string }[];
    onExport?: (format: string) => void;
}

const TableActions: React.FC<TableActionsProps> = ({
    searchValue,
    onSearchChange,
    onSearch,
    onFilterClick,
    areFiltersActive,
    onResetSearch,
    onResetFilters,
    isSearchActive,
    showExport = true,
    exportOptions,
    onExport,
}) => {
    const [exportDropdownOpen, setExportDropdownOpen] = React.useState(false);
    const exportDropdownRef = useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col md:flex-row justify-between items-center my-4 gap-5 px-4">
            <div className="flex flex-col md:flex-row gap-5 w-full">
                {/* Filter Button */}
                <button
                    className="border cursor-pointer border-primary bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]"
                    
                    onClick={() => {
                        if (areFiltersActive) {
                            onResetFilters();
                        } else {
                            onFilterClick()
                        }
                    }}
                >

                    {areFiltersActive ? <><X size={20} className="text-text-body" />
                    <span className="text-text-title font-poppins text-base">Clear Filter</span></>:
                    <><ListFilter size={16} />
                    <span className="text-text-title font-poppins text-base">Filter</span></> }
                    
                </button>

                {/* Search Input */}
                <div className="flex flex-row justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-background-alt w-full border-border rounded-l-[8px] p-3"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                    <button
                        className="bg-primary rounded-r-[8px] p-3 px-4 cursor-pointer"
                        onClick={() => {
                            if (isSearchActive) {
                                onResetSearch();
                            } else {
                                console.log(searchValue.trim());
                                
                                searchValue.length > 0 &&  onSearch(searchValue.trim());
                            }
                        }}
                    >
                        {isSearchActive ? 
                        <X size={24} className="text-text-body" /> :  <Search size={24} className="text-text-body" /> }
                    </button>

                </div>
            </div>

            {/* Export Dropdown - Only show if showExport is true */}
            {showExport && (
                <div className="relative" ref={exportDropdownRef}>
                    <button
                        className="bg-[#010101CC] flex gap-3 justify-center items-center px-6 py-3 rounded-[12px] text-white"
                        onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                    >
                        <Image src={icons.exportIcon} alt="Export Icon" className="w-6 h-6 text-white" />
                        <span className="font-poppins text-base">Export</span>
                    </button>

                    {exportDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-xl py-1 bg-white z-10">
                            {exportOptions?.map((option) => (
                                <button
                                    key={option.format}
                                    className="block px-4 py-2 text-sm text-gray-700 w-full border-border hover:bg-primary-alpha-8 text-left border-b"
                                    onClick={() => {
                                        onExport && onExport(option.format);
                                        setExportDropdownOpen(false);
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TableActions;