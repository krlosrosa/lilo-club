import { redirect } from "next/navigation";

/** Compat: links antigos /estabelecimentos/:id/geral → edição fica em /estabelecimentos/:id */
export default async function EstabelecimentoGeralLegacyRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/estabelecimentos/${id}`);
}
