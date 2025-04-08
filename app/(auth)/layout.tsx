export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="min-h-[calc(100vh-64px)] grid place-items-center">
        {children}
      </div>
    </main>
  );
}
