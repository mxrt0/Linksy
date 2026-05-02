using Linksy.Data.Models;
using Linksy.Services.DTOs.Auth;
using Linksy.Services.Results.Auth;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core.Contracts;

public interface IAuthService
{
    Task<AuthResult> RegisterAsync(RegisterRequest request);
    Task<AuthResult> LoginAsync(LoginRequest request);
    Task<ApplicationUser?> GetUserByNameAsync(string username);
}
