using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Results.Link;

public class RedirectLinkResult
{
    public Guid? Id { get; }
    public string? UserId { get; }
    public string? OriginalUrl { get; }
    public bool IsPasswordProtected { get; }
    public string? ShortCode { get; }
    public RedirectLinkFailureReason? FailureReason { get; }
    public string? ErrorMessage { get; }

    public bool Success => FailureReason is null;

    public RedirectLinkResult(Guid id, string userId, string originalUrl,
        bool isPasswordProtected, string shortCode)
    {
        Id = id;
        OriginalUrl = originalUrl;
        IsPasswordProtected = isPasswordProtected;
        UserId = userId;
        ShortCode = shortCode;
    }

    public RedirectLinkResult(RedirectLinkFailureReason failureReason)
    {
        FailureReason = failureReason;
        ErrorMessage = failureReason switch
        {
            RedirectLinkFailureReason.NotFound => "Link not found.",
            RedirectLinkFailureReason.Inactive => "Link is inactive.",
            RedirectLinkFailureReason.Expired => "Link has expired.",
            _ => "An unknown error occurred."
        };
    }
}

public enum RedirectLinkFailureReason
{
    NotFound,
    Inactive,
    Expired
}
