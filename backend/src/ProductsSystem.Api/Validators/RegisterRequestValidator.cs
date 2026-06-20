using FluentValidation;
using ProductsSystem.Api.DTOs.Auth;

namespace ProductsSystem.Api.Validators;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Nombre)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(150);

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El correo es obligatorio.")
            .EmailAddress().WithMessage("Correo inválido.")
            .MaximumLength(256);

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("La contraseña es obligatoria.")
            .MinimumLength(8).WithMessage("Mínimo 8 caracteres.")
            .Matches("[A-Z]").WithMessage("Debe incluir al menos una mayúscula.")
            .Matches("[a-z]").WithMessage("Debe incluir al menos una minúscula.")
            .Matches("[0-9]").WithMessage("Debe incluir al menos un número.");
    }
}
