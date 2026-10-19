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
      <head>
        <link rel="preload" as="image" href="/images/photos/robotic_class1.webp" type="image/webp" />
        <link rel="preload" as="image" href="/images/photos/art_class2.webp" type="image/webp" />
        <link rel="preload" as="image" href="/images/photos/karate_class1.webp" type="image/webp" />
        <link rel="preload" as="image" href="/images/photos/learn_with_fun.webp" type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
