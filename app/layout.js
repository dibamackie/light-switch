import "./globals.css";

export const metadata = {
  title: "First Light",
  description: "A quiet interactive light-switch experiment."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
