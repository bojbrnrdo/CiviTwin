import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "CiviTwin | Engineering Workspace", description: "Photorealistic civil engineering BIM and simulation platform" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
