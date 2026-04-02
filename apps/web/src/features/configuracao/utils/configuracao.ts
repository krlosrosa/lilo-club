import type { AuthMeResponse } from "@lilo-hub/contracts";

export const TIPOS_USUARIO = [
  { value: "cliente" as const, label: "Cliente" },
  { value: "dono" as const, label: "Dono" },
  { value: "parceiro" as const, label: "Parceiro" },
];

export function badgeLabelConfig(me: AuthMeResponse) {
  if (me.platformRole === "super_admin") return "Super admin";
  const t = me.tipoUsuario;
  if (t === "dono") return "Dono";
  if (t === "parceiro") return "Parceiro";
  if (t === "cliente") return "Cliente";
  return "Perfil";
}

export function membroDesdeFmt(createdAt: number) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(createdAt));
  } catch {
    return "—";
  }
}
