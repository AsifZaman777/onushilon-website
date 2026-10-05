import { Bricolage_Grotesque, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", weight: ["500", "700", "800"] });
const body = Hind_Siliguri({ subsets: ["latin", "bengali"], variable: "--f-body", weight: ["400", "500", "600"] });

export const metadata = {
  title: "Onushilon Academy | Learn by practising",
  description: "Courses, mentors and daily practice for students in Bangladesh.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
