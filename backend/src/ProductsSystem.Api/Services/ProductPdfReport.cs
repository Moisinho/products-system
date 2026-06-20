using System.Globalization;
using ProductsSystem.Api.DTOs.Products;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace ProductsSystem.Api.Services;

public class ProductPdfReport : IProductPdfReport
{
    // Formato monetario invariante (compatible con InvariantGlobalization, sin ICU).
    private static string Money(decimal v) =>
        "$" + v.ToString("#,##0.00", CultureInfo.InvariantCulture);

    public byte[] Generate(IReadOnlyList<ProductResponse> products)
    {
        var total = products.Count;
        var activos = products.Count(p => p.Estado);
        var valor = products.Where(p => p.Estado).Sum(p => p.Precio);

        return Document.Create(doc =>
        {
            doc.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(36);
                page.DefaultTextStyle(t =>
                    t.FontFamily("DejaVu Sans").FontSize(10).FontColor("#11212D"));

                page.Header().Column(header =>
                {
                    header.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Reporte de Productos").FontSize(18).Bold().FontColor("#06141B");
                            c.Item().Text($"Generado: {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC")
                                .FontSize(9).FontColor("#4A5C6A");
                        });
                        row.ConstantItem(160).AlignRight().Column(c =>
                        {
                            c.Item().Text($"Total: {total}").SemiBold();
                            c.Item().Text($"Activos: {activos}").FontColor("#3F7A5B");
                            c.Item().Text($"Valor inventario: {Money(valor)}").FontColor("#4A5C6A");
                        });
                    });
                    header.Item().PaddingTop(8).LineHorizontal(1).LineColor("#CCD0CF");
                });

                page.Content().PaddingVertical(10).Table(table =>
                {
                    table.ColumnsDefinition(cols =>
                    {
                        cols.RelativeColumn(3);  // Nombre
                        cols.RelativeColumn(4);  // Descripción
                        cols.RelativeColumn(2);  // Precio
                        cols.RelativeColumn(1.5f); // Estado
                    });

                    table.Header(h =>
                    {
                        static IContainer HeadCell(IContainer c) => c
                            .Background("#253745").PaddingVertical(6).PaddingHorizontal(6);

                        h.Cell().Element(HeadCell).Text("Nombre").FontColor("#FFFFFF").SemiBold();
                        h.Cell().Element(HeadCell).Text("Descripción").FontColor("#FFFFFF").SemiBold();
                        h.Cell().Element(HeadCell).AlignRight().Text("Precio").FontColor("#FFFFFF").SemiBold();
                        h.Cell().Element(HeadCell).AlignCenter().Text("Estado").FontColor("#FFFFFF").SemiBold();
                    });

                    var i = 0;
                    foreach (var p in products)
                    {
                        var bg = i++ % 2 == 0 ? "#FFFFFF" : "#F4F6F6";
                        IContainer BodyCell(IContainer c) => c
                            .Background(bg).BorderBottom(0.5f).BorderColor("#E1E4E4")
                            .PaddingVertical(5).PaddingHorizontal(6);

                        BodyCell(table.Cell()).Text(p.Nombre);
                        BodyCell(table.Cell()).Text(p.Descripcion ?? "—").FontColor("#4A5C6A");
                        BodyCell(table.Cell()).AlignRight().Text(Money(p.Precio));
                        BodyCell(table.Cell()).AlignCenter()
                            .Text(p.Estado ? "Activo" : "Inactivo")
                            .FontColor(p.Estado ? "#3F7A5B" : "#B5453C");
                    }
                });

                page.Footer().AlignCenter().Text(t =>
                {
                    t.Span("Página ").FontSize(8).FontColor("#9BA8AB");
                    t.CurrentPageNumber().FontSize(8).FontColor("#9BA8AB");
                    t.Span(" / ").FontSize(8).FontColor("#9BA8AB");
                    t.TotalPages().FontSize(8).FontColor("#9BA8AB");
                });
            });
        }).GeneratePdf();
    }
}
