import type { MetadataRoute } from "next";

/** Lets phones install Family Table to the home screen with its own icon. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Family Table",
    short_name: "Family Table",
    description: "Healthy lunch and dinner planner for the family",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f4",
    theme_color: "#047857",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
