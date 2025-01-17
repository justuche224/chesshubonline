const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="py-6 pt-20 bg-gradient-to-b h-screen from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {children}
      </div>
    </>
  );
};

export default Layout;
