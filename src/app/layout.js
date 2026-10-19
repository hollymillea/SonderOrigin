import "./globals.css";
import "./fonts.css";
import { settings } from "@/data/settings";
import { ContentProvider } from "@/components/Content/ContentProvider";

export const metadata = {
  title: `${settings.title} — Artist-led. Story-driven.`,
  description: settings.description,
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
        <ContentProvider>{children}</ContentProvider>
      </body>
    </html>
  );
}
