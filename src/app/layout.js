import "./globals.css";
import "./fonts.css";

export const metadata = {
  title: "Sonder Origin — Artist-led. Story-driven.",
  description: "A collective dedicated to elevating artists through creative direction, social strategy, and content creation.",
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
