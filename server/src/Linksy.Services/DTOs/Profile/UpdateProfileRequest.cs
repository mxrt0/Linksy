using Linksy.Data.Enums;
using System;
using System.Collections.Generic;
using static Linksy.Data.Common.EntityValidation.ApplicationUser;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Linksy.Services.DTOs.Profile;

public class UpdateProfileRequest
{
    [StringLength(DisplayNameMaxLength, MinimumLength = DisplayNameMinLength,
        ErrorMessage = "Display name must be between {2} and {1} characters.")]
    public string DisplayName { get; set; } = null!;
    public AnalyticsRange DefaultAnalyticsRange { get; set; } = AnalyticsRange.ThirtyDays;
    public bool WeeklySummaryEnabled { get; set; }
    public bool ExpiryReminderEnabled { get; set; }
}
