import BillPayHeader from "./components/BillPayHeader";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <BillPayHeader />
            {children}
        </div>

    );
}