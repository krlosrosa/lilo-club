import Link from "next/link";
import { BrandMark } from "@lilo-hub/ui";
import { StatusSection } from "@/components/status-section";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8">
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
