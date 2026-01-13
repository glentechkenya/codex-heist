export const metadata = {
  title: "Codex Heist",
  description: "Neon encrypted chat arena"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "black", color: "#3b82f6" }}>
        {children}
      </body>
    </html>
  );
}
