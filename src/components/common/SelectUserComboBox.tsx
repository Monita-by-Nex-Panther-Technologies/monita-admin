// import { useState, useEffect, FC, Dispatch, SetStateAction } from "react";
// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxOption,
//   ComboboxOptions,
// } from "@headlessui/react";
// import { CheckIcon } from "lucide-react";
// import { cn } from "@/utilities/utils";
// import CustomerSelectSpinner from "../ui/CustomerSelectSpinner";

// interface CustomerSelectProps {
//   onChange: Dispatch<SetStateAction<string | null>>;
//   value: string | null;
//   label?: string;
//   placeHolder?: string;
//   className?: string;
//   labelClassName?: string;
//   inputClassName?: string;
//   containerClassName?: string;
//   dropdownClassName?: string;
// }

// const CustomerSelect: FC<CustomerSelectProps> = ({
//   onChange,
//   label,
//   placeHolder = "Select",
//   containerClassName,
//   labelClassName,
//   inputClassName,
//   dropdownClassName,
// }) => {

//   const [query, setQuery] = useState("");
//   const [selected, setSelected] = useState<any | null>(null);

//   const { queried_customers: customer, isLoadingQuery: isLoading } =
//     useAppSelector(getCustomerState);

//   const handleOnChange = (value: any) => {
//     onChange(value?._id);
//     setSelected(value);
//   };

//   useEffect(() => {
//     if (query.trim() === "" || query.length < 3) return;
//     const timeoutId = setTimeout(() => {
//       dispatch(getQueriedCustomers({ query: query }));
//     }, 500); // 500ms debounce

//     return () => clearTimeout(timeoutId);
//   }, [query, dispatch]);

//   // Reset values when pathname changes
//   useEffect(() => {
//     setQuery("");
//     setSelected(null);
//   }, [location.pathname]);

//   return (
//     <div className={`w-full ${containerClassName}`}>
//       {label && (
//         <label
//           className={cn(
//             "block text-sm font-medium dark:text-gray-300 mb-3",
//             labelClassName
//           )}
//         >
//           {label}
//         </label>
//       )}
//       <Combobox
//         immediate
//         value={selected}
//         onChange={handleOnChange}
//         onClose={() => setQuery("")}
//       >
//         <div className="relative">
//           <ComboboxInput
//             placeholder={placeHolder}
//             className={cn(
//               "relative w-full bg-white dark:bg-dark dark:text-gray-400 dark:border-gray-400 border rounded-lg  pl-3 pr-10 py-3 text-left focus:outline-none focus:border-[#1A2327] dark:focus:border-gray-400",
//               inputClassName
//             )}
            
//             displayValue={(business: any) => business?.email ?? ""}
//             onChange={(event) => setQuery(event.target.value)}
//           />
//           {isLoading ? (
//             <div className="group absolute top-3 right-8 px-1.5 ">
//               <CustomerSelectSpinner size="sm" />
//             </div>
//           ) : null}
//         </div>

//         <ComboboxOptions
//           className={cn(
//             "w-full bg-white dark:bg-dark dark:border-gray-400 border rounded-lg max-h-60 p-1 z-[10000] shadow-lg overflow-auto [--anchor-gap:var(--spacing-1)] empty:visible",
//             "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-1",
//             dropdownClassName
//           )}
//         >
//           {customer?.customers?.length > 0 ? (
//             customer?.customers?.map((business: any) => (
//               <ComboboxOption
//                 key={business._id}
//                 value={business}
//                 className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-brand-orange/10"
//               >
//                 <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
              
//                 <div className="flex items-center gap-2 my-4">
//                   <div className="w-10 h-10 rounded-md bg-red-100 flex items-center justify-center text-black text-md font-semibold">
//                   {business?.lastname.charAt(0).toUpperCase() || ""} {business?.firstname.charAt(0).toUpperCase() || ""}
//                   </div>
//                   <div>
//                     <div className="flex flex-col">
//                     <span className="capitalize  dark:text-white font-semibold"> {business?.firstname || ""} {business?.lastname || ""}</span>
//                     <span className="  dark:text-white text-sm"> {business?.email || ""} </span>
//                     </div>
//                   </div>
//                 </div>
//                 {/* <div className="text-sm/6 dark:text-gray-400">
//                   {business?.email}
//                 </div> */}
//               </ComboboxOption>
//             ))
//           ) : (
//             <div className="p-4 text-center font-medium dark:text-gray-400">
//               No options found
//             </div>
//           )}
//         </ComboboxOptions>
//       </Combobox>
//     </div>
//   );
// };

// export default CustomerSelect;
