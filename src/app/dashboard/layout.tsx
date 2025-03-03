import DBHeader from "@/components/common/DBHeader";
import Sidebar from "@/components/ui/Sidebar";

// app/dashboard/layout.tsx
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen bg-background-alt">
            {/* Sidebar */}
            <aside className="w-[275px] bg-background border-r border-sidebar-border fixed top-0 left-0 h-screen overflow-y-auto ">
                <Sidebar />
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-[275px] overflow-y-auto">
                <div className="h-full">
                    <DBHeader />
                    <div className=" w-full p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}