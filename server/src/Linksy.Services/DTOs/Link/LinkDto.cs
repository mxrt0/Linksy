using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Link;

public class LinkDto
{
    public Guid Id { get; set; }
    public string ShortCode { get; set; } = null!;
    public string OriginalUrl { get; set; } = null!;
    public string ShortUrl { get; set; } = null!;
    public DateTime CreatedAt { get; set; } 
    public bool IsActive { get; set; }  
    public int Clicks { get; set; }
}
