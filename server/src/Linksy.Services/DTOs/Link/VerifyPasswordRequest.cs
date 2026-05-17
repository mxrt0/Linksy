using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Link;

public class UnlockRequest
{
    public string Password { get; set; } = null!;
}
