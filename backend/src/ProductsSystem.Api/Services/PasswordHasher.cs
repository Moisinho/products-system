namespace ProductsSystem.Api.Services;

/// <summary>
/// Hashing de contraseñas con BCrypt (salt embebido, work factor 12).
/// </summary>
public class PasswordHasher : IPasswordHasher
{
    private const int WorkFactor = 12;

    public string Hash(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public bool Verify(string password, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch (BCrypt.Net.SaltParseException)
        {
            // Hash mal formado / dummy → tratamos como no-coincidencia.
            return false;
        }
    }
}
