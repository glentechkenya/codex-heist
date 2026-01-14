export const metadata = {
  title: "Codex Heist",
  description: "A futuristic shared arena"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{
        margin: 0,
        background: "radial-gradient(circle at top, #0a0014, #000)",
        color: "#a78bfa",
        fontFamily: "system-ui, sans-serif",
        overflow: "hidden"
      }}>
        {children}
        <style>{`
          * { box-sizing: border-box; }
        `}</style>
      </body>
    </html>
  );
}
