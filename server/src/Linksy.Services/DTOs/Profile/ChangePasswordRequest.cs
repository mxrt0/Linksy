using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Profile;

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = null!;
    public string NewPassword { get; set; } = null!;    
}
