import Kbar from "@/components/kbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Kbar>{children}</Kbar>;
}
