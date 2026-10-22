import type { Metadata, Viewport } from "next";
import TextSize from "@/components/TextSize";
import Nav from "@/components/Nav";
import { PeopleProvider } from "@/components/PeopleProvider";
import { PlanProvider } from "@/components/PlanProvider";
import { FavouritesProvider } from "@/components/FavouritesProvider";
import { PhotosProvider } from "@/components/PhotosProvider";
import { ExtrasProvider } from "@/components/ExtrasProvider";
import { MyRecipesProvider } from "@/components/MyRecipesProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family Table",
  description: "Easy, low-salt family recipes and a meal planner",
  appleWebApp: { capable: true, title: "Family Table", statusBarStyle: "default" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#047857" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set the saved text size before the page paints, so it does not jump. */}
        <script dangerouslySetInnerHTML={{ __html: `try{var s=[13,15,17,19,21,24],l=localStorage.getItem("family-table-text-level");if(l===null&&localStorage.getItem("family-table-big-text")==="1")l=4;if(l!==null&&s[+l])document.documentElement.style.setProperty("--ft-size",s[+l]+"px")}catch(e){}` }} />
      </head>
      <body className="min-h-screen pb-24 md:pb-0">
        <div className="no-print"><Nav /></div>
        <TextSize />
        <PlanProvider>
          <PeopleProvider>
            <FavouritesProvider>
              <PhotosProvider>
                <ExtrasProvider>
                  <MyRecipesProvider>
                    <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
                  </MyRecipesProvider>
                </ExtrasProvider>
              </PhotosProvider>
            </FavouritesProvider>
          </PeopleProvider>
        </PlanProvider>
      </body>
    </html>
  );
}
