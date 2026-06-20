import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Salida mínima para la imagen Docker (server.js + deps requeridas).
  output: "standalone",
  // No filtrar el framework en cabeceras de respuesta.
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
