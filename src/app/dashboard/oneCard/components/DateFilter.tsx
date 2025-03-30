"use client";

interface DateFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function DateFilter({
  activeFilter,
  onFilterChange,
}: DateFilterProps) {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center bg-background p-4 rounded-[8px] gap-4 md:gap-0">
      <h1 className="text-text-title text-xl font-semibold font-poppins">
        Filter by Date
      </h1>
      <div className="w-full md:w-auto flex flex-col sm:flex-row bg-background-alt gap-1.5 sm:gap-x-1.5 px-3 py-2 rounded-[8px]">
        <button
          className={`justify-center items-center ${
            activeFilter === "Today"
              ? "bg-primary-light border border-primary"
              : "bg-background"
          } text-text-body font-poppins px-4 py-3 w-full sm:w-[120px] md:w-[186px] rounded-[8px]`}
          onClick={() => onFilterChange("Today")}
        >
          Today
        </button>
        <button
          className={`justify-center items-center ${
            activeFilter === "This Week"
              ? "bg-primary-light border border-primary"
              : "bg-background"
          } text-text-body font-poppins px-4 py-3 w-full sm:w-[120px] md:w-[186px] rounded-[8px]`}
          onClick={() => onFilterChange("This Week")}
        >
          This Week
        </button>
        <button
          className={`justify-center items-center ${
            activeFilter === "This Year"
              ? "bg-primary-light border border-primary"
              : "bg-background"
          } text-text-body font-poppins px-4 py-3 w-full sm:w-[120px] md:w-[186px] rounded-[8px]`}
          onClick={() => onFilterChange("This Year")}
        >
          This Year
        </button>
      </div>
    </div>
  );
}
