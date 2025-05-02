import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
