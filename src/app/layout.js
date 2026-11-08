import "./globals.css";
import "./fonts.css";
import { settings } from "../data/settings";
import { ContentProvider } from "../components/Content/ContentProvider";
import { SiteCursor } from "../components/Cursor/SiteCursor";

export const metadata = {
  title: settings.title,
  description: settings.description,
  // Chosen in Site settings → General; a change appears after the next build
  icons: { icon: settings.tabIcon || "/images/tab-icon.png" },
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
        <ContentProvider>
          <SiteCursor />
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}
