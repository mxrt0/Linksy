using Linksy.Data.Models;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Auth;
using Linksy.Services.Results.Auth;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core;

public class AuthService(UserManager<ApplicationUser> userManager) : IAuthService
{
    public async Task<ApplicationUser?> GetUserByNameAsync(string username)
    {
        return await userManager.FindByNameAsync(username);
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request)
    {
       var user = new ApplicationUser
        {
            UserName = request.Username,
            Email = request.Email,
            CreatedAt = DateTime.UtcNow
        };

        var result = await userManager.CreateAsync(user, request.Password);

        return new AuthResult
        {
            Succeeded = result.Succeeded,
            UserId = result.Succeeded ? user.Id : null,
            Errors = result.Errors.Select(e => e.Description)
        };
    }
}
