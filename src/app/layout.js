import "./globals.css";
import GoogleTranslateLoader from "../app/components/GoogleTranslateLoader";
import LanguageSwitcher from "../app/components/LanguageSwitcher";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Load hidden Google widget */}
        <GoogleTranslateLoader  />

        {/* Your custom dropdown */}
        {/* <LanguageSwitcher /> */}

        {children}
      </body>
    </html>
  );
}
