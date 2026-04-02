import type { ReactNode } from "react";
import { EstabelecimentoSubnav } from "@/features/estabelecimento";

export default async function EstabelecimentoLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="w-full space-y-4 pb-6 pt-1 sm:px-4">
      <EstabelecimentoSubnav estabelecimentoId={id} />
      {children}
    </div>
  );
}
