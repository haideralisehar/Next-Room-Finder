import "./globals.css";
import GoogleTranslateLoader from "../app/components/GoogleTranslateLoader";
import LanguageSwitcher from "../app/components/LanguageSwitcher";
import {Jost} from "next/font/google";

const jost = Jost({
  subsets:['latin']
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>City In Booking</title>
        <meta name="description" content="This is my awesome Next.js application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={jost.className}>
        {/* Load hidden Google widget */}
        <GoogleTranslateLoader />

        {children}
      </body>
    </html>
  );
}
