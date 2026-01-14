export const metadata = {
  title: "Codex Heist",
  description: "Encrypted neon chat arena"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
