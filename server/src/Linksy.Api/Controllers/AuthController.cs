using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Linksy.Api.Controllers;

public class AuthController(
    IConfiguration config,
    IAuthService authService,
    IJwtService jwtService
) : BaseController
{
    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await authService.LoginAsync(request);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var newJwt = jwtService.GenerateToken(result.UserId!, result.Username!);

        Response.Cookies.Append("jwt", newJwt, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(config.GetValue<double>("Jwt:ExpiryMinutes"))
        });

        return Ok(new AuthResponse
        {
            Username = result.Username!
        });
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register([FromBody] RegisterRequest request)
    {
        var result = await authService.RegisterAsync(request);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var newJwt = jwtService.GenerateToken(result.UserId!, request.Username);

        Response.Cookies.Append("jwt", newJwt, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(config.GetValue<double>("Jwt:ExpiryMinutes"))
        });

        return Ok(new AuthResponse
        {
            Username = request.Username
        });
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        Response.Cookies.Delete("jwt");
        return Ok();
    }
}
