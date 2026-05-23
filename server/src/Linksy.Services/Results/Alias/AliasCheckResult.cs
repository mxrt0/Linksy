using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Results.Alias;

public class AliasCheckResult
{
    public bool IsAvailable { get; init; }
    public string? Reason { get; init; }
    public List<string>? Suggestions { get; init; }

    public static AliasCheckResult Available() => new() { IsAvailable = true };
    public static AliasCheckResult FailWithSuggestions(
        AliasUnavailableReason reason,
        List<string> suggestions) 
        => new()
        {
            IsAvailable = false,
            Reason = reason.ToString(),
            Suggestions = suggestions
        };
}

public enum AliasUnavailableReason
{
    Taken,
    InvalidFormat,
    Reserved,
    TooShort,
    TooLong,
    Profanity,
    Blacklisted,
    Unknown
}