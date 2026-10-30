export async function verifyTurnstile(
  token?: string | null,
  ip?: string | null
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Lewati verifikasi jika di development dan secret key belum diatur
  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      return { success: true };
    }
    return { success: false, error: "Turnstile secret key belum dikonfigurasi" };
  }

  if (!token) {
    return { success: false, error: "Verifikasi anti-bot Cloudflare diperlukan" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) formData.append("remoteip", ip);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) {
      return { success: false, error: "Verifikasi anti-bot gagal. Silakan ulangi." };
    }

    return { success: true };
  } catch (err) {
    console.error("Gagal menghubungi verifikasi Cloudflare Turnstile:", err);
    return { success: false, error: "Gagal memverifikasi keamanan." };
  }
}

