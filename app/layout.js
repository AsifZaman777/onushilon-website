import { Bricolage_Grotesque, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--f-display", weight: ["500", "700", "800"] });
const body = Hind_Siliguri({ subsets: ["latin", "bengali"], variable: "--f-body", weight: ["400", "500", "600", "700"] });

export const metadata = {
  title: "Onushilon Academy | অনুশীলন একাডেমি — Learn by practicing",
  description: "Courses, mentors and daily practice for students in Bangladesh. লাইভ ক্লাস, মেন্টরশিপ ও প্রতিদিনের অনুশীলন।",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${display.variable} ${body.variable}`}>
      <head>
        <link rel="preload" as="image" href="https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/robotic_class1.webp" type="image/webp" />
        <link rel="preload" as="image" href="https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/art_class2.webp" type="image/webp" />
        <link rel="preload" as="image" href="https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/karate_class1.webp" type="image/webp" />
        <link rel="preload" as="image" href="https://okhqtcykqdkivxsghyrv.supabase.co/storage/v1/object/public/onushilon/photos/learn_with_fun.webp" type="image/webp" />
      </head>
      <body>{children}</body>
    </html>
  );
}
