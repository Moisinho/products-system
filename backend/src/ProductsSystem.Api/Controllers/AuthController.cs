using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using ProductsSystem.Api.Data;
using ProductsSystem.Api.DTOs.Auth;
using ProductsSystem.Api.Entities;
using ProductsSystem.Api.Services;

namespace ProductsSystem.Api.Controllers;

[ApiController]
[Route("api/auth")]
[AllowAnonymous]
[EnableRateLimiting("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokens;

    public AuthController(AppDbContext db, IPasswordHasher hasher, ITokenService tokens)
    {
        _db = db;
        _hasher = hasher;
        _tokens = tokens;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Register(RegisterRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();

        var exists = await _db.Users.AnyAsync(u => u.Email == email, ct);
        if (exists)
            // Mensaje genérico: no confirmamos si el correo ya existe (anti-enumeración).
            return BadRequest(new { message = "No se pudo completar el registro." });

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email,
            Nombre = request.Nombre.Trim(),
            PasswordHash = _hasher.Hash(request.Password),
            FechaCreacion = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);

        var (token, expiresAt) = _tokens.CreateToken(user);
        return Ok(new AuthResponse(token, expiresAt, user.Email, user.Nombre));
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Login(LoginRequest request, CancellationToken ct)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

        if (user is null)
        {
            // Quemamos un hash para igualar el tiempo de respuesta y evitar
            // enumeración por timing; respuesta genérica idéntica al pass incorrecto.
            _hasher.Hash(request.Password);
            return Unauthorized(new { message = "Credenciales inválidas." });
        }

        if (!_hasher.Verify(request.Password, user.PasswordHash))
            return Unauthorized(new { message = "Credenciales inválidas." });

        var (token, expiresAt) = _tokens.CreateToken(user);
        return Ok(new AuthResponse(token, expiresAt, user.Email, user.Nombre));
    }
}
