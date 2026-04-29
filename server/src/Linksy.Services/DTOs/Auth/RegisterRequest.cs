using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Auth;

public sealed record RegisterRequest(string Username, string Email, string Password);
