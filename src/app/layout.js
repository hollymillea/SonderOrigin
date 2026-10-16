import "./globals.css";
import "./fonts.css";

export const metadata = {
  title: "Sonder Origin — Artist-led. Story-driven.",
  description: "A collective dedicated to elevating artists through creative direction, social strategy, and content creation.",
};

// Safari tints its bars from this. The paper grain over the white page
// averages out to #f4f4f4 on screen (--paper in globals.css), so match that
// rather than the plain white beneath it
export const viewport = {
  themeColor: "#f4f4f4",
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
