"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    window.history.replaceState(null, "", window.location.pathname);
    router.replace("/");
  }, [router]);

  return (
    <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center px-6 py-12">
      <p className="text-sm">A concluir sessão…</p>
    </div>
  );
}
