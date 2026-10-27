import { readFile } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/session";
import { TIPE, UPLOAD_DIR } from "@/lib/lampiran";

// Hanya admin yang boleh melihat lampiran
export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const s = await getSession();
  if (!s.adminId) return new Response("Tidak diizinkan", { status: 401 });

  const { file } = await params;
  const m = /^[a-f0-9]{32}\.(jpg|png|webp)$/.exec(file);
  if (!m) return new Response("Tidak ditemukan", { status: 404 });

  try {
    const data = await readFile(path.join(UPLOAD_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": TIPE[m[1] as keyof typeof TIPE],
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Tidak ditemukan", { status: 404 });
  }
}
