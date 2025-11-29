// app/layout.tsx

import { Toaster } from "react-hot-toast";
import "./globals.css";
import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Tathastu Ayurveda",   // 🔥 Browser tab title
//   description: "Official Tathastu Ayurveda Products",
// };

export const metadata = {
  title: "Tathastu Ayurveda",
  description:
    "Empowering individuals through health, wellness, and community development.",
  icons: {
    icon: "/vercel.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        {children}

        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
