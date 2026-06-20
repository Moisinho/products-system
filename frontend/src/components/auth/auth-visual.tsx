import { Boxes } from "lucide-react";

/**
 * Panel visual del split-screen de autenticación.
 * Composición 100% CSS/SVG (sin imágenes externas): gradiente + rejilla
 * "blueprint" + glow de marca + wireframe arquitectónico abstracto.
 */
export function AuthVisual() {
  return (
    <div className="relative hidden overflow-hidden lg:block">
      <div className="absolute inset-0 bg-gradient-to-br from-sidebar via-background to-background" />
      <div className="absolute inset-0 bg-blueprint opacity-60" />
      <div className="absolute inset-0 brand-glow" />

      {/* Wireframe arquitectónico abstracto */}
      <svg
        aria-hidden
        className="absolute -right-24 bottom-0 h-[80%] w-auto text-foreground/[0.07]"
        viewBox="0 0 400 500"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M40 500 L40 180 L200 80 L360 180 L360 500" />
        <path d="M120 500 L120 230 L200 180 L280 230 L280 500" />
        <path d="M40 180 L360 180 M40 260 L360 260 M40 340 L360 340 M40 420 L360 420" />
        <path d="M200 80 L200 500 M120 230 L280 230" />
        <path
          className="text-brand/40"
          stroke="currentColor"
          d="M40 180 L200 80 L360 180"
          strokeWidth="1.5"
        />
        <circle cx="200" cy="80" r="3" className="fill-brand/60" stroke="none" />
      </svg>

      <div className="relative flex h-full flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground">
            <Boxes className="size-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Products<span className="text-muted-foreground">System</span>
          </span>
        </div>

        <div className="glass max-w-md rounded-2xl p-6">
          <p className="text-xl leading-snug font-medium text-foreground">
            Gestiona tu inventario con precisión.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Una plataforma para administrar tu catálogo, controlar el estado de
            tus productos y generar reportes en segundos.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand" />
            ProductsSystem — control total de tu catálogo
          </div>
        </div>
      </div>
    </div>
  );
}
