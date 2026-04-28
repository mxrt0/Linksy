using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Linksy.Data.Models;

public class Link
{
    public Guid Id { get; set; }

    [ForeignKey(nameof(User))]
    public string UserId { get; set; } = null!;
    public ApplicationUser User { get; set; } = null!;

    public string ShortCode { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; }
}
