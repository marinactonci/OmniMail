export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="h-screen grid place-items-center">
        {children}
      </div>
    </main>
  );
}
