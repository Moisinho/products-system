import { Boxes, FileText, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Boxes,
    title: "Catálogo centralizado",
    desc: "Crea, edita y filtra tus productos en un solo lugar.",
  },
  {
    icon: FileText,
    title: "Reportes en PDF",
    desc: "Exporta el inventario con un clic, respetando tus filtros.",
  },
  {
    icon: ShieldCheck,
    title: "Acceso seguro",
    desc: "Autenticación con JWT y sesión protegida.",
  },
];

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
        className="absolute -right-24 top-10 h-[55%] w-auto text-foreground/[0.06]"
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

      <div className="relative flex h-full flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm">
            <Boxes className="size-6" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">
            Products<span className="text-muted-foreground">System</span>
          </span>
        </div>

        <div className="max-w-md space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight text-foreground">
              Gestiona tu inventario
              <br />
              con precisión.
            </h2>
            <p className="text-sm text-muted-foreground">
              Una plataforma para administrar tu catálogo, controlar el estado de
              tus productos y generar reportes en segundos.
            </p>
          </div>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="flex items-start gap-3">
                <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
                  <Icon className="size-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-brand" />
          ProductsSystem — control total de tu catálogo
        </div>
      </div>
    </div>
  );
}
