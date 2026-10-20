import "../globals.css";

export const metadata = { title: "Admin · May", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="paper min-h-full">{children}</body>
    </html>
  );
}
