using FluentValidation;
using ProductsSystem.Api.DTOs.Products;

namespace ProductsSystem.Api.Validators;

public class ProductRequestValidator : AbstractValidator<ProductRequest>
{
    public ProductRequestValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(200);

        RuleFor(x => x.Descripcion)
            .MaximumLength(1000);

        RuleFor(x => x.Precio)
            .GreaterThan(0).WithMessage("El precio debe ser mayor a 0.")
            .LessThanOrEqualTo(9_999_999).WithMessage("El precio excede el máximo permitido.");
    }
}
