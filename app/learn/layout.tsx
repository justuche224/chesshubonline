import Footer from "@/components/Footer";
import PublicNav from "@/components/PublicNav";

const Authlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PublicNav />
      <main className="py-6 pt-20 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Authlayout;
