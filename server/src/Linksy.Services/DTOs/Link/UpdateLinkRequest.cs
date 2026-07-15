using Linksy.Common.Enums;
using System.ComponentModel.DataAnnotations;

namespace Linksy.Services.DTOs.Link;

public class UpdateLinkRequest
{
    [Required]
    [Url]
    public string OriginalUrl { get; set; } = null!;

    [Required]
    public string ShortCode { get; set; } = null!;

    public string? Password { get; set; }
    public bool RemovePassword { get; set; }
    public LinkExpiry Expiry { get; set; }
    public bool IsActive { get; set; }
}
