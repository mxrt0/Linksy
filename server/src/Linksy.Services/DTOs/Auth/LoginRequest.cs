using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Auth;

public record LoginRequest(string Email, string Password);
