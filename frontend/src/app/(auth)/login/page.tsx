"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Boxes, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, type LoginValues } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const brandInput = "focus-visible:border-brand focus-visible:ring-brand/30";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (params.get("expired")) {
      toast.info("Tu sesión expiró. Vuelve a iniciar sesión.");
    }
  }, [params]);

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message ?? "Credenciales inválidas");
        return;
      }
      toast.success("Bienvenido de nuevo");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Marca (solo visible cuando el panel visual está oculto) */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <div className="grid size-9 place-items-center rounded-lg bg-brand text-brand-foreground">
          <Boxes className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">
          Products<span className="text-muted-foreground">System</span>
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tus credenciales para acceder a tu panel.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="admin@products.io"
                    autoComplete="email"
                    className={`h-11 ${brandInput}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña *</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`h-11 ${brandInput}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-11 w-full bg-brand text-brand-foreground shadow-sm transition-colors hover:bg-brand/90"
            disabled={loading}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Entrar
          </Button>
        </form>
      </Form>

      <div className="rounded-lg border border-brand-subtle-foreground/20 bg-brand-subtle/40 px-3.5 py-2.5 text-xs text-brand-subtle-foreground">
        Cuenta demo: <span className="font-medium">admin@products.io</span> ·{" "}
        <span className="font-medium">Admin123!</span>
      </div>

      <p className="text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-medium text-brand underline-offset-4 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
