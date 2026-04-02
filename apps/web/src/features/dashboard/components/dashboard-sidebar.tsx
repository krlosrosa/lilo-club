"use client";

import { queryKeys } from "@lilo-hub/clients";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  Store,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore, type ComponentProps, type ComponentType } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { dashboardBrowserApi } from "../api";

const BRAND_TITLE = "Guia comercial";
const BRAND_TAGLINE = "Gestão de negócios";

function useEstabelecimentosActive(pathname: string) {
  return pathname === "/estabelecimentos" || pathname.startsWith("/estabelecimentos/");
}

function NavRow({
  icon: Icon,
  label,
  isActive,
  className,
  ...props
}: ComponentProps<"button"> & {
  icon: ComponentType<{ className?: string }>;
  label: string;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold tracking-tight transition-colors active:scale-[0.98]",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        className,
      )}
      {...props}
    >
      <Icon className="size-4.5 shrink-0" />
      {label}
    </button>
  );
}

function NavLinkRow({
  href,
  icon: Icon,
  label,
  isActive,
  onNavigate,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold tracking-tight transition-colors active:scale-[0.98]",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-4.5 shrink-0" />
      {label}
    </Link>
  );
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();

  const estabActive = useEstabelecimentosActive(pathname);
  const contaActive = pathname === "/configuracao" || pathname.startsWith("/configuracao/");

  const logoutMutation = useMutation({
    mutationFn: () => dashboardBrowserApi.postLogout(),
    onSuccess: async () => {
      await queryClient.resetQueries({ queryKey: queryKeys.authMe });
      onNavigate?.();
      router.replace("/login");
    },
    onError: () => {
      toast.error("Não foi possível sair. Tente novamente.");
    },
  });

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const onFeedback = () => {
    toast.message("Em breve", { description: "Área de feedback em desenvolvimento." });
    onNavigate?.();
  };

  const onSuporte = () => {
    const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      toast.message("Em breve", { description: "Canal de suporte em configuração." });
    }
    onNavigate?.();
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="mb-6 shrink-0 px-2">
        <p className="text-xl font-bold tracking-tight text-foreground">{BRAND_TITLE}</p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {BRAND_TAGLINE}
        </p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain">
        <NavLinkRow
          href="/estabelecimentos"
          icon={LayoutDashboard}
          label="Dashboard"
          isActive={estabActive}
          onNavigate={onNavigate}
        />
        <NavLinkRow
          href="/estabelecimentos"
          icon={Store}
          label="Estabelecimentos"
          isActive={estabActive}
          onNavigate={onNavigate}
        />
        <NavRow icon={MessageSquare} label="Feedback" onClick={onFeedback} />
        <NavLinkRow
          href="/configuracao"
          icon={User}
          label="Minha conta"
          isActive={contaActive}
          onNavigate={onNavigate}
        />
        <NavRow icon={LifeBuoy} label="Suporte" onClick={onSuporte} />
      </nav>

      <div className="mt-auto shrink-0 border-t border-border pt-4 flex flex-col gap-1">
        <Button
          type="button"
          variant="ghost"
          className="h-auto justify-start gap-3 px-3 py-2.5 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => {
            toggleTheme();
          }}
          disabled={!isClient}
          aria-label={
            isClient && resolvedTheme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
          }
        >
          {isClient && resolvedTheme === "dark" ? (
            <Sun className="size-4.5 shrink-0" />
          ) : (
            <Moon className="size-4.5 shrink-0" />
          )}
          Alternar tema
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="h-auto justify-start gap-3 px-3 py-2.5 font-semibold text-muted-foreground hover:text-foreground"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          aria-label="Sair da conta"
        >
          <LogOut className="size-4.5 shrink-0" />
          Sair
        </Button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex w-full flex-col md:sticky md:top-0 md:h-svh md:max-h-svh md:w-64 md:shrink-0 md:self-start">
      <div className="bg-card flex shrink-0 items-center gap-2 border-b border-border px-3 py-2 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button type="button" variant="outline" size="icon-sm" aria-label="Abrir menu">
              <Menu className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex h-full max-h-svh w-[min(100vw,16rem)] max-w-[16rem] flex-col gap-0 p-0 px-4 py-6"
            showCloseButton
          >
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarBody onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="truncate text-sm font-semibold text-foreground">{BRAND_TITLE}</span>
      </div>

      <aside className="bg-card border-border hidden min-h-0 w-full flex-1 flex-col gap-2 border-r py-6 pr-4 pl-4 md:flex md:h-full md:min-h-0 md:shrink-0 md:flex-col md:overflow-hidden md:border-b-0">
        <SidebarBody />
      </aside>
    </div>
  );
}
