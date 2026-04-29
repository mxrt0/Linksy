using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Results.Auth;

public class AuthResult
{
    public bool Succeeded { get; set; }
    public IEnumerable<string> Errors { get; set; } = Enumerable.Empty<string>();
    public string? UserId { get; set; }
}
