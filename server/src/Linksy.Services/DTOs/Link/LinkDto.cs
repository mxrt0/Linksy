using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Link;

internal class LinkDto
{
    public string ShortCode { get; set; } = null!;
    public string OriginalUrl { get; set; } = null!;
    public string ShortUrl { get; set; } = null!;
}
