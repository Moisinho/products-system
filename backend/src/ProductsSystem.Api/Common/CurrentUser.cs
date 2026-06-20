using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace ProductsSystem.Api.Common;

/// <summary>
/// Lee la identidad del usuario autenticado desde los claims del JWT.
/// Se usa para poblar UsuarioCreacion/UsuarioModificacion en el servidor.
/// </summary>
public class CurrentUser
{
    private readonly IHttpContextAccessor _accessor;

    public CurrentUser(IHttpContextAccessor accessor) => _accessor = accessor;

    private ClaimsPrincipal? Principal => _accessor.HttpContext?.User;

    public Guid Id
    {
        get
        {
            var sub = Principal?.FindFirstValue(JwtRegisteredClaimNames.Sub)
                      ?? Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.TryParse(sub, out var id) ? id : Guid.Empty;
        }
    }

    public string? Email => Principal?.FindFirstValue(JwtRegisteredClaimNames.Email)
                            ?? Principal?.FindFirstValue(ClaimTypes.Email);
}
