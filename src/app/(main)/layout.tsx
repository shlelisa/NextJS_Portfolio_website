import Header from "@/app/(main)/CustomerSide/components/Header";
import Footer from "@/app/(main)/CustomerSide/components/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
