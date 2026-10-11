import type { Metadata, Viewport } from "next";
import TextSize from "@/components/TextSize";
import Nav from "@/components/Nav";
import { PeopleProvider } from "@/components/PeopleProvider";
import { PlanProvider } from "@/components/PlanProvider";
import "./globals.css";

export const metadata: Metadata = { title: "Family Table", description: "Family meal planner for 8" };
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen pb-24 md:pb-0">
        <div className="no-print"><Nav /></div>
        <TextSize />
        <PlanProvider>
          <PeopleProvider>
            <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
          </PeopleProvider>
        </PlanProvider>
      </body>
    </html>
  );
}
