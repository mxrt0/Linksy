using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core.Contracts;

public interface IJwtService
{
    string GenerateToken(string userId, string username);
}
