const Authlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main
      style={{
        backgroundImage:
          'url("/images/black-white-chess-pieces-black-background.jpg")',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
      className="flex items-center min-h-screen justify-center w-full"
    >
      {children}
    </main>
  );
};

export default Authlayout;
