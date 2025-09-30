import "./globals.css";
export const metadata = { title: "Delivery Routes" };

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>
      <main className="container">
        <div className="shell">{children}</div>
      </main>
      </body>
      </html>
  );
}