import DashboardMetrics from "@/components/common/DashboardMetrics"
import DBAnalyticsSection from "@/components/common/DBAnalyticsSection"
import DBRecentActivities from "@/components/common/DBRecentActivities"


const page = () => {
    return (
        <div className=" w-full">
            <DashboardMetrics />
            <DBAnalyticsSection />
            <DBRecentActivities />

        </div>
    )
}

export default page
