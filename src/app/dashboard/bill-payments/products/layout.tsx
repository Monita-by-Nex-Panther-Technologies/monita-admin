import ProductNavSection from "./components/ProductsNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <ProductNavSection />
      {children}
    </div>
  );
}
