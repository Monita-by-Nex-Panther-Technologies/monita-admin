// import { ChartType } from './StatisricStore';
import { appname, ums_endpoint, wms_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import moment from "moment";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
export interface StatisticsBlock {
    total: number;
    creditAmount: number;
    debitAmount: number;
    net: number;
}


interface UserDemographicsData {
    name: string;
    value: number;
    color: string;
}
export type QueryType = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type ChartType = 'volume' | 'trend';


export interface StatisticsBlockParams {
    queryType?: QueryType;
    chartType?: ChartType;
    startDate?: Date;
    endDate?: Date;
}

export interface UserGrowthData {
    name: string;
    active: number;
    inactive: number;
}

export interface TransactionVolumeData {
    name: string;
    value: number;
}


export const useStatisticsStore = create<StatisticState>()(
    persist((set, get) => ({
        statisticsdataBlock: null,
        transactionVolume: [],
        userGrowth: [],
        userDemographics: [],
        isLoadingStatsBlock: false,
        isLoadingDemographics: false,
        queryType: 'daily',
        chartType: 'volume',
        isLoadingCharts: false,
        // Default value
        startDate: undefined,
        endDate: undefined,

        // setField: <K extends keyof StatisticState>(field: K, value: StatisticState[K]) => {
        //     set({ [field]: value } as Pick<StatisticState, K>);

        //     if (field === 'queryType' || field === 'chartType') {
        //         const state = get();

        //         // Only update transaction volume if chartType changes or if queryType changes
        //         if (field === 'chartType' || (field === 'queryType' && value !== state.queryType)) {
        //             const params = {
        //                 queryType: field === 'queryType' ? value as QueryType : state.queryType,
        //                 chartType: field === 'chartType' ? value as ChartType : state.chartType
        //             };

        //             // Fetch new data with updated params
        //             get().getTransactionVolumeData(params);
        //         }

        //         // Update user growth data if queryType changes
        //         if (field === 'queryType' && value !== state.queryType) {
        //             get().getUserGrowthData({ queryType: value as QueryType });
        //         }
        //     }

        // },
        setField: <K extends keyof StatisticState>(field: K, value: StatisticState[K]) => {
            set({ [field]: value } as Pick<StatisticState, K>);

            const state = get();

            // Create params object that will be passed to data fetching functions
            const params: StatisticsBlockParams = {
                queryType: field === 'queryType' ? value as QueryType : state.queryType,
                chartType: field === 'chartType' ? value as ChartType : state.chartType,
                startDate: field === 'startDate' ? value as Date : state.startDate,
                endDate: field === 'endDate' ? value as Date : state.endDate,
            };

            // Conditionally update data based on which field changed
            if (field === 'queryType') {
                // When query type changes, update all data
                get().getStatisticsBlock(params);
                get().getTransactionVolumeData(params);
                get().getUserGrowthData(params);
                get().getUserDemographicsData(params);
            } else if (field === 'chartType') {
                // When chart type changes, only update transaction volume
                get().getTransactionVolumeData(params);
            } else if (field === 'startDate' || field === 'endDate') {
                // Only update if both dates are set or if we're clearing the date range
                const bothDatesSet = (state.startDate || field === 'startDate') &&
                    (state.endDate || field === 'endDate');
                const clearingDates = value === undefined;

                if (bothDatesSet || clearingDates) {
                    get().getStatisticsBlock(params);
                    get().getTransactionVolumeData(params);
                    get().getUserGrowthData(params);
                    get().getUserDemographicsData(params);
                }
            }
        },

        // Add a new function to initialize all data at once
        initializeAllData: () => {
            const state = get();
            const params = {
                queryType: state.queryType,
                chartType: state.chartType,
                startDate: state.startDate,
                endDate: state.endDate
            };

            // Load all data in parallel
            return Promise.all([
                get().getStatisticsBlock(params),
                get().getTransactionVolumeData(params),
                get().getUserGrowthData(params),
                get().getUserDemographicsData(params)
            ]);
        },
        getStatisticsBlock: async (params?: StatisticsBlockParams) => {
            set({ isLoadingStatsBlock: true });
            const state = get();
            try {
                // Use provided params or fallback to stored state values
                const queryParams = new URLSearchParams({
                    queryType: params?.queryType || 'weekly',
                    // ...(params?.startDate && { startDate: moment(params.startDate).local().toISOString() }),
                    // ...(params?.endDate && { endDate: moment(params.endDate).local().toISOString() }),
                    ...(state.startDate && !params?.startDate && state.queryType === 'custom' && { startDate: moment(state.startDate).local().toISOString() }),
                    ...(state.endDate && !params?.endDate && state.queryType === 'custom' && { endDate: moment(state.endDate).local().toISOString() }),
                });

                // If params were provided, update the state with them
                if (params) {
                    set({
                        queryType: params.queryType || 'weekly',
                        ...(params.startDate && { startDate: params.startDate }),
                        ...(params.endDate && { endDate: params.endDate }),
                    });
                }

                const { data } = await axiosInstance.get(
                    `${wms_endpoint}/transactions/statistics/block?${queryParams.toString()}`
                );

                set({
                    statisticsdataBlock: data,
                    isLoadingStatsBlock: false,
                });
            } catch (error: any) {
                set({ isLoadingStatsBlock: false });
                throw new Error(getErrorMessage(error));
            }
        },


        getUserDemographicsData: async (params?: StatisticsBlockParams) => {
            set({ isLoadingDemographics: true });

            try {
                const state = get();
                const queryParams = new URLSearchParams({
                    queryType: params?.queryType || state.queryType,
                    ...(params?.startDate && { startDate: moment(params.startDate).local().toISOString() }),
                    ...(params?.endDate && { endDate: moment(params.endDate).local().toISOString() }),
                    ...(state.startDate && !params?.startDate && state.queryType === 'custom' && { startDate: moment(state.startDate).local().toISOString() }),
                    ...(state.endDate && !params?.endDate && state.queryType === 'custom' && { endDate: moment(state.endDate).local().toISOString() }),
                });

                // If params were provided, update the state with them
                if (params) {
                    set({
                        ...(params.queryType && { queryType: params.queryType }),
                        ...(params.startDate && { startDate: params.startDate }),
                        ...(params.endDate && { endDate: params.endDate }),
                    });
                }

                // API call to the real endpoint - replace with your actual endpoint
                const { data } = await axiosInstance.get(
                    `${ums_endpoint}/users/demographics?${queryParams.toString()}`
                );

                // Define a color palette for the data
                const colors = ["#2D3748", "#0088FE", "#FF4560", "#00C49F", "#FFBB28", "#AF19FF", "#4ECDC4", "#7B68EE"];

                // Process the data to add colors
                const processedData = data && data.length > 0
                    ? data.map((item: any, index: any) => ({
                        ...item,
                        color: colors[index % colors.length],
                    }))
                    : [];

                // Set the data from the API response
                set({
                    userDemographics: processedData,
                    isLoadingDemographics: false,
                });
            } catch (error) {
                // In case of error, set empty array to avoid UI breaking
                set({
                    userDemographics: [],
                    isLoadingDemographics: false,
                });

                console.error('Error fetching user demographics data:', getErrorMessage(error));
            }
        },
        getTransactionVolumeData: async (params?: StatisticsBlockParams) => {
            set({ isLoadingCharts: true });
            const state = get();
            try {
                // Use provided params or fallback to stored state values
                const queryParams = new URLSearchParams({
                    queryType: params?.queryType || 'daily',
                    chartType: params?.chartType || 'volume',
                    ...(state.startDate && !params?.startDate && state.queryType === 'custom' && { startDate: moment(state.startDate).local().toISOString() }),
                    ...(state.endDate && !params?.endDate && state.queryType === 'custom' && { endDate: moment(state.endDate).local().toISOString() }),
                    // ...(params?.startDate && { startDate: moment(params.startDate).local().toISOString() }),
                    // ...(params?.endDate && { endDate: moment(params.endDate).local().toISOString() }),
                });

                // If params were provided, update the state with them
                if (params) {
                    set({
                        queryType: params.queryType || 'weekly',
                        ...(params.startDate && { startDate: params.startDate }),
                        ...(params.endDate && { endDate: params.endDate }),
                    });
                }

                // Replace with the actual endpoint when available
                const { data } = await axiosInstance.get(
                    `${wms_endpoint}/transactions/volume?${queryParams.toString()}`
                );

                set({
                    transactionVolume: data || [],
                    isLoadingCharts: false,
                });
            } catch (error: any) {
                // In case of error, set some fallback data so UI doesn't break
                set({
                    transactionVolume: [],
                    isLoadingCharts: false,
                });

                // Continue with fallback data if the endpoint doesn't exist yet
                console.warn('Error fetching user growth data, using fallback data instead:', getErrorMessage(error));

                // Fallback data

            }
        },

        getUserGrowthData: async (params?: StatisticsBlockParams) => {
            set({ isLoadingCharts: true });

            try {

                const state = get();
                const queryParams = new URLSearchParams({
                    queryType: params?.queryType || 'weekly',
                    ...(params?.startDate && { startDate: moment(params.startDate).local().toISOString() }),
                    ...(params?.endDate && { endDate: moment(params.endDate).local().toISOString() }),
                    ...(state.startDate && !params?.startDate && state.queryType === 'custom' && { startDate: moment(state.startDate).local().toISOString() }),
                    ...(state.endDate && !params?.endDate && state.queryType === 'custom' && { endDate: moment(state.endDate).local().toISOString() }),
                });

                // If params were provided, update the state with them
                if (params) {
                    set({
                        ...(params.queryType && { queryType: params.queryType }),
                        ...(params.startDate && { startDate: params.startDate }),
                        ...(params.endDate && { endDate: params.endDate }),
                    });
                }

                // API call to the real endpoint
                const { data } = await axiosInstance.get(
                    `${ums_endpoint}/users/statistics?${queryParams.toString()}`
                );

                // Set the data from the API response
                set({
                    userGrowth: data || [],
                    isLoadingCharts: false,
                });
            } catch (error: any) {
                // In case of error, set empty array to avoid UI breaking
                set({
                    userGrowth: [],
                    isLoadingCharts: false,
                });

                console.error('Error fetching user growth data:', getErrorMessage(error));


            }
        },
    }),








        {
            name: `${appname}-stats`,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                queryType: state.queryType,
                startDate: state.startDate,
                chartType: state.chartType,
                endDate: state.endDate,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isLoadingStatsBlock = false;
                    //   state.isLoadingCardStats = false;
                    state.isLoadingCharts = false;



                }
            },
        }

    )
);




interface StatisticState {
    // statisticsBlock: StatisticsBlock | null;

    statisticsdataBlock: StatisticsBlock | null;
    transactionVolume: TransactionVolumeData[];
    userGrowth: UserGrowthData[];
    isLoadingStatsBlock: boolean;
    isLoadingDemographics: boolean;
    userDemographics: UserDemographicsData[];
    isLoadingCharts: boolean;
    queryType: QueryType;
    chartType: ChartType;
    startDate?: Date;
    endDate?: Date;

    setField: <K extends keyof StatisticState>(field: K, value: StatisticState[K]) => void;
    getStatisticsBlock: (params?: StatisticsBlockParams) => Promise<void>;
    getTransactionVolumeData: (params?: StatisticsBlockParams) => Promise<void>;
    getUserGrowthData: (params?: StatisticsBlockParams) => Promise<void>;
    getUserDemographicsData: (params?: StatisticsBlockParams) => Promise<void>;
    initializeAllData: () => Promise<void[]>;
}