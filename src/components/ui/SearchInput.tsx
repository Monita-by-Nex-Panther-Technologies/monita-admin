import React from "react";
import { Input } from "@/components/ui/input"; // Import the Input component
import { Search } from "lucide-react"; // Import the search icon

interface SearchInputProps {
    placeholder?: string; // Optional placeholder text
    className?: string; // Optional className for custom styling
    value?: string; // Optional value for controlled input
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Optional onChange handler
}

export const SearchInput: React.FC<SearchInputProps> = ({
    placeholder = "Search...",
    className,
    value,
    onChange,
}) => {
    return (
        <div className={`relative ${className}`}>
            {/* Search Icon */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#01010129]" />

            {/* Input Field */}
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="pl-10 py-4 w-[350px] h-12 border-[#0D0D0D3D] border rounded-lg placeholder:text-#01010129 text-base placeholder:text-base bg-background-alt focus-visible:ring-1 focus-visible:ring-ring " // Add padding to the left for the icon
            />
        </div>
    );
};