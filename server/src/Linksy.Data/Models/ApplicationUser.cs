using Linksy.Data.Enums;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Data.Models;

public class ApplicationUser : IdentityUser
{
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string DisplayName { get; set; } = null!;
    public AnalyticsRange DefaultAnalyticsRange { get; set; } = AnalyticsRange.ThirtyDays;
    public bool WeeklySummaryEnabled { get; set; }
    public bool ExpiryReminderEnabled { get; set; }
}
