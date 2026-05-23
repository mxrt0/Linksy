using Linksy.Services.Results.Alias;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core.Contracts;

public interface IAliasService
{
    Task<AliasCheckResult> CheckAsync(string alias);
    Task<string> GenerateUniqueAsync(string? baseAlias = null);
    string GeneratePreviewAlias();
}
