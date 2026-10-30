import { sql } from "@/lib/db";
import { packages as fallbackPackages, type Package } from "@/lib/data";

export interface DbPackage {
  id: string;
  name: string;
  duration: string;
  route: string;
  summary: string;
  priceIdr: number;
  highlights: string[];
  isActive: boolean;
}

export async function getActivePackages(): Promise<Package[]> {
  try {
    const rows = await sql`
      SELECT 
        id, 
        name, 
        duration, 
        route, 
        summary, 
        price_idr as "priceIdr", 
        highlights, 
        is_active as "isActive"
      FROM packages
      WHERE is_active = TRUE
      ORDER BY price_idr ASC;
    `;

    if (rows.length === 0) {
      return fallbackPackages;
    }

    return rows.map((r) => ({
      id: r.id as string,
      name: r.name as string,
      duration: r.duration as string,
      route: r.route as string,
      summary: r.summary as string,
      priceIdr: Number(r.priceIdr),
      highlights: (r.highlights as string[]) || [],
    }));
  } catch (err) {
    console.warn("Gagal mengambil packages dari database, memakai fallback data lokal:", err);
    return fallbackPackages;
  }
}

export async function getAllPackages(): Promise<DbPackage[]> {
  try {
    const rows = await sql`
      SELECT 
        id, 
        name, 
        duration, 
        route, 
        summary, 
        price_idr as "priceIdr", 
        highlights, 
        is_active as "isActive"
      FROM packages
      ORDER BY price_idr ASC;
    `;

    if (rows.length === 0) {
      return fallbackPackages.map((p) => ({ ...p, isActive: true }));
    }

    return rows.map((r) => ({
      id: r.id as string,
      name: r.name as string,
      duration: r.duration as string,
      route: r.route as string,
      summary: r.summary as string,
      priceIdr: Number(r.priceIdr),
      highlights: (r.highlights as string[]) || [],
      isActive: Boolean(r.isActive),
    }));
  } catch (err) {
    console.warn("Gagal mengambil semua packages dari database:", err);
    return fallbackPackages.map((p) => ({ ...p, isActive: true }));
  }
}

