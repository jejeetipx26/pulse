import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionData = { adminId?: number; nama?: string };

const options: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "pulse_admin",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), options);
}

export async function requireAdmin() {
  const s = await getSession();
  if (!s.adminId) redirect("/admin/login");
  return { adminId: s.adminId, nama: s.nama ?? "Admin" };
}
