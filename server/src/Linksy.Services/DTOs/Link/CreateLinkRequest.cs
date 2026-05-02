using Linksy.Common.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Linksy.Services.DTOs.Link;

public class CreateLinkRequest
{
    [Url]
    public string OriginalUrl { get; set; } = null!;
    public string ShortCode { get; set; } = null!;
    public LinkExpiry Expiry { get; set; }  
}
