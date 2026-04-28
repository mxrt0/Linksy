using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Linksy.Data.Models;

public class Click
{
    public Guid Id { get; set; }
    
    [ForeignKey(nameof(Link))]
    public Guid LinkId { get; set; }
    public Link Link { get; set; } = null!;

    public DateTime ClickedAt { get; set; } = DateTime.UtcNow;
    public string IpAddress { get; set; } = null!;
    public string UserAgent { get; set; } = null!;
    public string Referer { get; set; } = null!;
}
