import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import FormLogin from "@/app/components/admin/FormLogin";

export default async function LoginAdmin() {
  const s = await getSession();
  if (s.adminId) redirect("/admin");
  return (
    <section className="relative flex min-h-[80dvh] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 animate-float rounded-full bg-aqua/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 animate-float rounded-full bg-primary/30 blur-3xl" style={{ animationDelay: "-3s" }} />

      <div className="relative w-full max-w-sm animate-fade-up">
        <div className="absolute -inset-1 animate-glow rounded-[2rem] bg-linear-to-br from-aqua via-primary to-indigo opacity-70 blur-sm" />
        <div className="relative rounded-3xl bg-white p-7 sm:p-8">
          <div className="mx-auto flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-linear-to-br from-navy to-ocean shadow-[0_0_24px_rgba(23,155,194,0.6)]">
            <Image src="/images/logo.png" alt="Logo PULSE" width={44} height={44} className="h-11 w-11 object-contain" />
          </div>
          <h1 className="mt-5 text-center text-2xl font-bold">Masuk admin</h1>
          <p className="mb-6 mt-1 text-center text-sm text-navy/65">Khusus pengurus BEM PSIK.</p>
          <FormLogin />
        </div>
      </div>
    </section>
  );
}
