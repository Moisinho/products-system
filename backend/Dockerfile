# syntax=docker/dockerfile:1

# ---------- Build ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore primero (mejor caché de capas)
COPY src/ProductsSystem.Api/ProductsSystem.Api.csproj src/ProductsSystem.Api/
RUN dotnet restore src/ProductsSystem.Api/ProductsSystem.Api.csproj

# Copiar el resto y publicar
COPY src/ src/
RUN dotnet publish src/ProductsSystem.Api/ProductsSystem.Api.csproj \
    -c Release -o /app/publish --no-restore /p:UseAppHost=false

# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# curl: healthcheck de compose
# libfontconfig1 + fonts-dejavu-core: render de texto en QuestPDF/SkiaSharp
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl libfontconfig1 fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

# Usuario no-root incluido en la imagen aspnet:8.0
USER app

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_EnableDiagnostics=0

ENTRYPOINT ["dotnet", "ProductsSystem.Api.dll"]
