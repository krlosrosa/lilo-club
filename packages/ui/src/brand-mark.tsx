import type { ReactNode } from 'react';

export type BrandMarkProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function BrandMark({ title, subtitle, children }: BrandMarkProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      {children}
    </div>
  );
}
