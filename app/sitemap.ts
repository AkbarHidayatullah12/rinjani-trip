import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/gunung-rinjani",
    "/jalur-pendakian",
    "/musim-dan-iklim",
    "/persiapan",
    "/booking",
    "/syarat-ketentuan",
    "/kebijakan-pembatalan",
    "/kebijakan-privasi",
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/booking" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/booking" ? 0.9 : 0.8,
  }));
}

