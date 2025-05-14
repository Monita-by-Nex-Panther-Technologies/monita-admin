import { clsx, type ClassValue } from "clsx"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from "dayjs/plugin/advancedFormat";

import { twMerge } from "tailwind-merge"


dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

function getOrdinalSuffix(day: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = day % 100;
  return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}




export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorMessage = (error: any) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  } else if (error?.response?.message) {
    return error.response.message;
  } else if (error?.data?.message) {
    return error.data.message;
  } else if (error?.message) {
    return error.message;
  } else {
    return "An unknown error occurred";
  }
};


export function formatAmount(
  amount: string | number,
  noDecimal: boolean = false,
  showCurrency: boolean = false
): string  {
  // Convert the amount to a number if it's a string
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "N";
  }

  // Define the options for formatting
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: noDecimal ? 0 : 2,
    maximumFractionDigits: noDecimal ? 0 : 2,
  };

  const currencyOptions: Intl.NumberFormatOptions = {
    ...options,
    style: "currency",
    currency: "NGN",
  };

  // Create a formatter for the given locale (assuming 'en-US' here for comma separation)
  const formatter = new Intl.NumberFormat("en-NG", options);

  if (showCurrency) {
    return new Intl.NumberFormat("en-NG", currencyOptions).format(numAmount);
  }

  return formatter.format(numAmount);
}


export function formatNumber( num: number): string {
  if (num === null || num === undefined || isNaN(num)) return "";

  const absNum = Math.abs(num);

  let formattedNum;
  if (absNum >= 1000000000) {
    formattedNum = (absNum / 1000000000).toFixed(1) + "B"; // Billions
  } else if (absNum >= 1000000) {
    formattedNum = (absNum / 1000000).toFixed(1) + "M"; // Millions
  } else if (absNum >= 1000) {
    formattedNum = (absNum / 1000).toFixed(1) + "k"; // Thousands
  } else {
    formattedNum = absNum.toString();
  }

  return num < 0 ? `-${formattedNum}` : formattedNum;
}


export function formatedDate(
  date?: string,
  format: string = "Do, MMM YYYY h:mm A",
  isAdvanced: boolean = true
): string {
  if (!date) return "";

  const dayjsDate = dayjs(date).tz("Africa/Lagos");;

  if (!isAdvanced) {
    return dayjsDate.format(format);
  }

  const dayWithSuffix = getOrdinalSuffix(dayjsDate.date());
  const shortMonthName = dayjsDate.format("MMM"); //
  const fullYear = dayjsDate.format("YYYY");
  const time = dayjsDate.format("h:mm A");

  return `${dayWithSuffix}, ${shortMonthName} ${fullYear} ${time}`;
}



export  const createEllipsePagination = (totalPages:number, currentPage:number) => {
  const pageNumbers = [];

  // Always show the first page
  pageNumbers.push(1);

  // Add ellipses and surrounding pages
  if (currentPage > 3) {
      pageNumbers.push('...');
  }

  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
  }

  // Always show the last page
  if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
  }
  if (totalPages > 1) {
      pageNumbers.push(totalPages);
  }

  return pageNumbers;
};

export function isEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function replacePrefix(phoneNumber:string) {
  if (phoneNumber.startsWith("+234")) {
      return "0" + phoneNumber.slice(4); // Replace +234 with 0
  }
  return phoneNumber; // Return the number unchanged if it doesn't start with +234
}

export function combineArrayToObject(months: string[], values: number[]): { name: string; value: number }[] {
  return months.map((month, index) => ({
    name: month,
    value: values[index]
  }));
}
