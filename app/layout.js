export const metadata = {
  title: "Codex Heist",
  description: "Neon encrypted chat arena"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "black", color: "#8b5cf6", overflow: "hidden" }}>
        {/* Matrix Rain */}
        <div id="matrix" style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "radial-gradient(circle at top, #0a0014, black)",
          animation: "pulse 6s infinite alternate"
        }} />
        {children}
        <style>{`
          @keyframes pulse {
            from { filter: brightness(1); }
            to { filter: brightness(1.3); }
          }
        `}</style>
      </body>
    </html>
  );
}
