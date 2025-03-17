import PlanHeadder from "./components/PlanHeader";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <PlanHeadder />
            {children}
        </div>

    );
}