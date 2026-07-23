using Linksy.Data.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Linksy.Services.DTOs.Profile;

public class ProfileDto
{
    public string DisplayName { get; set; } = null!;                     
    public string? UserName { get; set; }
    public string? Email { get; init; }
    public AnalyticsRange DefaultAnalyticsRange { get; set; } = AnalyticsRange.ThirtyDays;
    public bool WeeklySummaryEnabled { get; set; }
    public bool ExpiryReminderEnabled { get; set; }
    public DateTime CreationDate { get; set; }
}
