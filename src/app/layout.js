import "./globals.css";
import GoogleTranslateLoader from "../app/components/GoogleTranslateLoader";
import LanguageSwitcher from "../app/components/LanguageSwitcher";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Next.js App</title>
        <meta name="description" content="This is my awesome Next.js application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Load hidden Google widget */}
        <GoogleTranslateLoader />

        {children}
      </body>
    </html>
  );
}
