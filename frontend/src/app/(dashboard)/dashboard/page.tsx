import Link from "next/link";
import { ArrowRight, Boxes, Download, Plus, type LucideIcon } from "lucide-react";
import { PageTransition } from "@/components/common/page-transition";
import { ProductsKpis } from "@/components/products/products-kpis";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";

function QuickAction({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-brand/40 hover:bg-card"
    >
      <div className="grid size-9 shrink-0 place-items-center rounded-md bg-brand/15 text-brand transition-transform group-hover:scale-105">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}

export default async function DashboardPage() {
  const user = await getSession();
  const first = (user?.nombre ?? "Usuario").split(" ")[0];

  return (
    <PageTransition className="space-y-6">
      {/* Hero de bienvenida — fondo siempre oscuro, por eso forzamos tokens
          dark en este subárbol para garantizar contraste en light y dark */}
      <section className="dark relative overflow-hidden rounded-2xl border border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-sidebar to-background" />
        <div className="absolute inset-0 bg-blueprint opacity-50" />
        <div className="brand-glow absolute inset-0 opacity-90" />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand">Panel de control</p>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Hola de nuevo, {first}
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Este es el resumen de tu inventario. Gestiona productos, revisa su
              estado y genera reportes en PDF.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Link href="/products/new">
                <Plus className="size-4" />
                Nuevo producto
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <Link href="/products">
                Ver productos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <ProductsKpis />

      {/* Acciones rápidas + estado */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-medium">Acciones rápidas</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Atajos a las tareas más comunes.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <QuickAction
              href="/products"
              icon={Boxes}
              title="Catálogo"
              desc="Ver y filtrar productos"
            />
            <QuickAction
              href="/products/new"
              icon={Plus}
              title="Crear"
              desc="Añadir un producto"
            />
            <QuickAction
              href="/products"
              icon={Download}
              title="Reporte"
              desc="Exportar a PDF"
            />
          </div>
        </div>

        <div className="glass flex flex-col rounded-xl p-5">
          <h3 className="text-sm font-medium">ProductsSystem</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Plataforma de gestión de catálogo con autenticación JWT, CRUD y
            reportes en PDF.
          </p>
          <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            Sistema operativo
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
