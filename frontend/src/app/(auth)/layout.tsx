import { AuthVisual } from "@/components/auth/auth-visual";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Toggle de tema (claro/oscuro) */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <AuthVisual />
      <div className="relative flex items-center justify-center bg-background px-6 py-10 sm:px-10">
        {/* glow superior sutil cuando el panel visual está oculto (móvil) */}
        <div
          aria-hidden
          className="brand-glow pointer-events-none absolute inset-x-0 top-0 h-40 opacity-40 lg:hidden"
        />
        <div className="relative w-full max-w-[480px]">{children}</div>
      </div>
    </div>
  );
}
