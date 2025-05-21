import './styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>University Queue System</header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
