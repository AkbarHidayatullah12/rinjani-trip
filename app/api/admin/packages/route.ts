import { NextResponse } from "next/server";
import { getApiAdminAuth } from "@/lib/auth-helpers";
import { getAllPackages } from "@/lib/packages";

export async function GET() {
  try {
    const { user, errorResponse } = await getApiAdminAuth();
    if (errorResponse) return errorResponse;
    if (!user) return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });

    const packages = await getAllPackages();
    return NextResponse.json({ packages });
  } catch (err) {
    console.error("Gagal mengambil data packages:", err);
    return NextResponse.json({ error: "Gagal memuat paket pendakian" }, { status: 500 });
  }
}

