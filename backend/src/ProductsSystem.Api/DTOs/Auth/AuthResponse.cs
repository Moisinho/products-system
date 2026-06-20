namespace ProductsSystem.Api.DTOs.Auth;

public record AuthResponse(string Token, DateTime ExpiresAt, string Email, string Nombre);
