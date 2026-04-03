import Link from "next/link";
import { headers } from "next/headers";
import { BrandMark } from "@lilo-hub/ui";
import { StatusSection } from "@/components/status-section";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const h = await headers();
  const domain = h.get("x-host-domain") ?? "";
  const subdomain = h.get("x-host-subdomain") ?? "";

  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <p className="text-muted-foreground text-sm">
          Domínio: {domain || "—"} · Subdomínio:{" "}
          {subdomain || "(nenhum)"}
        </p>
        <BrandMark
          title="Guia comercial"
          subtitle="Monorepo Lilo Hub — web, API e pacotes compartilhados."
        >
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/estabelecimentos">Meus estabelecimentos</Link>
            </Button>
          </div>
        </BrandMark>
        <StatusSection />
      </main>
    </div>
  );
}
