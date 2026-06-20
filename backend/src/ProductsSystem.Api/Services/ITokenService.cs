using ProductsSystem.Api.Entities;

namespace ProductsSystem.Api.Services;

public interface ITokenService
{
    (string token, DateTime expiresAt) CreateToken(User user);
}
