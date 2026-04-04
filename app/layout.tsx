import "./globals.css";   // ✅ ADD THIS LINE

export const metadata = {
  title: "War Room",
  description: "Command Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}