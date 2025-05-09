import { create } from "zustand";
import { base_endpoint, wms_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { FilterCriteria } from "@/app/dashboard/transactions/components/TransactionFilterModal";

export const useTransactionStore = create<TransactionState>()(
    (set) => ({
      transactions: [],
      page: 1,
      statistic:null,
      limit: 10,
      total: 0,
      filterData: null,
      totalPages:0,
      isLoading: false,
      isQueryResult:false,
      isFilterResult:false,
      setField: <K extends keyof TransactionState>(field: K, value: TransactionState[K]) => {
        set({ [field]: value } as Pick<TransactionState, K>);
    },

      getTransactions: async ({
        page,
        limit,
        walletId,
        type,
        category,
        status,
        userId,
        reference,
        
      }: TransactionQueryParams) => {
        set({ isLoading: true });

        try {
          const query = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(walletId && { walletId }),
            ...(type && { type }),
            ...(category && { category }),
            ...(status && { status }),
            ...(userId && { userId }),
            ...(reference && { reference }),
          });

          set({
          isQueryResult: !!reference, // Explicitly cast to boolean
          isFilterResult: !!(walletId || type || category || status || userId), // Explicitly cast to boolean
          })

          const { data } = await axiosInstance.get(
            `${wms_endpoint}/transactions?${query.toString()}`
          );

          set({
            transactions: data.records,
            page: data.page,
            totalPages: Math.ceil(data.count / data.limit),
            limit: data.limit,
            total: data.count,
            isLoading: false,
                    });


        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(getErrorMessage(error));
        }
      },

      getTransactionStatistic: async () => {
        set({ isLoading: true });

        try {
        
          const { data } = await axiosInstance.get(
            `${wms_endpoint}/transactions/statistic`
          );

          set({
            statistic: data,
            isLoading: false,});


        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(getErrorMessage(error));
        }
      },

      updateTransaction: async (transactionId: string, updatedData: Partial<Transaction>) => {
        set({ isLoading: true });
        try {
          // Send PUT or PATCH request to update transaction on the server
          const response = await axiosInstance.patch(
            `${wms_endpoint}/transactions/${transactionId}`, 
            updatedData
          );
          
          // If successful, update the local store
          set((state) => {
            const updatedTransactions = state.transactions.map((transaction) =>
              transaction.id === transactionId
                ? { ...transaction, ...updatedData }
                : transaction
            );
            return { transactions: updatedTransactions, isLoading: false };
          });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(getErrorMessage(error));
        }
      },
    }),
    
);


  export interface Transaction {
    id: string;
    product: string;
    beneficiary: string;
    userId: string;
    walletId: string;
    amount: number;
    fee: number;
    totalAmount: number;
    previousBalance: number;
    newBalance: number;
    finalDebitOrCreditStatus: boolean;
    type: "DEBIT" | "CREDIT";
    status: "SUCCESS" | "PENDING" | "FAILED"; // adjust if needed
    currency: string;
    reference: string;
    providerReference: string;
    userReference: string;
    orderNo: string;
    narration: string | null;
    desc: string;
    category: string;
    metadata?: Record<string, any> | null; // Flexible metadata type to support varying structures
    failureReason: string | null;
    completedAt: string;
    failedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }



  interface TransactionQueryParams {
    page: number;
    limit: number;
    walletId?: string;
    type?: string;
    category?: string;
    status?: string;
    userId?: string;
    reference?: string;
  }


  interface TransactionStatistics {
    total: number;
    revenue: number;
    deposits: number;
    profit: number;
  }


  
  interface TransactionState {
    transactions: Transaction[];
    page: number;
    filterData: Partial<FilterCriteria> | null
    totalPages: number;
    limit: number;
    statistic:TransactionStatistics | null;
    total: number;
    isLoading: boolean;
    isQueryResult:boolean;
    isFilterResult:boolean;
    getTransactionStatistic: () => Promise<void>;
    getTransactions: (params: TransactionQueryParams) => Promise<void>;
    setField: <K extends keyof TransactionState>(field: K, value: TransactionState[K]) => void;
  }
  