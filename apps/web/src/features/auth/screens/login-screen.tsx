"use client";

import { BrandMark } from "@lilo-hub/ui";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginScreen() {
  return (
    <div className="flex flex-1 flex-col px-6 py-12">
      <main className="mx-auto flex w-full max-w-md flex-col gap-8">
        <BrandMark
          title="Entrar"
          subtitle="Utilize a sua conta Google para aceder ao painel."
        />
        <div className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <a href="/api/auth/google">Continuar com Google</a>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Voltar ao início</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
