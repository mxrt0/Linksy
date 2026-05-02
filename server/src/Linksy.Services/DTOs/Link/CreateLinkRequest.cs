using Linksy.Common.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Link;

public class CreateLinkRequest
{
    public string OriginalUrl { get; set; } = null!;
    public string ShortCode { get; set; } = null!;
    public LinkExpiry Expiry { get; set; }  
}
