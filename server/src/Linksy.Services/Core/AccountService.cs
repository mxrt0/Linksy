using Linksy.Data.Models;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Profile;
using Linksy.Services.Results;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Linksy.Services.Core;

public class AccountService(UserManager<ApplicationUser> userManager) : IAccountService
{
    public async Task<ServiceResult> ChangeUserPasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return ServiceResult.Fail("User not found");
        }

        if (await userManager.HasPasswordAsync(user))
        {
            var changeResult = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
            if (!changeResult.Succeeded)
            {
                var suggestions = new List<string>();
                foreach (var e in changeResult.Errors ?? Enumerable.Empty<IdentityError>())
                {
                    // Map Identity error codes to specific fields so the client can show field-level messages
                    var field = e.Code == "PasswordMismatch" ? "currentPassword" : "newPassword";
                    suggestions.Add($"{field}:{e.Description}");
                }
                return ServiceResult.Fail("Failed to change password", suggestions);
            }
            return ServiceResult.Ok();
        }

        var addResult = await userManager.AddPasswordAsync(user, request.NewPassword);
        if (!addResult.Succeeded)
        {
            var suggestions = addResult.Errors?.Select(e => $"newPassword:{e.Description}").ToList();
            return ServiceResult.Fail("Failed to set password", suggestions);
        }
        return ServiceResult.Ok();
    }

    public async Task<ServiceResult<ProfileDto>> GetUserProfileAsync(string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return ServiceResult<ProfileDto>.Fail("User not found");
        }

        var dto = new ProfileDto
        {
            DisplayName = user.DisplayName,
            UserName = user.UserName,
            Email = user.Email,
            DefaultAnalyticsRange = user.DefaultAnalyticsRange,
            WeeklySummaryEnabled = user.WeeklySummaryEnabled,
            ExpiryReminderEnabled = user.ExpiryReminderEnabled,
            CreationDate = user.CreatedAt
        };
        return ServiceResult<ProfileDto>.Ok(dto);
    }

    public async Task<ServiceResult> UpdateUserProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return ServiceResult.Fail("User not found");
        }

        user.DisplayName = request.DisplayName;
        user.DefaultAnalyticsRange = request.DefaultAnalyticsRange;
        user.WeeklySummaryEnabled = request.WeeklySummaryEnabled;
        user.ExpiryReminderEnabled = request.ExpiryReminderEnabled;
        var result = await userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            var errors = result.Errors?.Select(e => e.Description).ToList();
            return ServiceResult.Fail("Failed to update profile", errors);
        }

        var dto = new ProfileDto
        {
            DisplayName = user.DisplayName,
            UserName = user.UserName,
            Email = user.Email,
            DefaultAnalyticsRange = user.DefaultAnalyticsRange,
            WeeklySummaryEnabled = user.WeeklySummaryEnabled,
            ExpiryReminderEnabled = user.ExpiryReminderEnabled,
            CreationDate = user.CreatedAt
        };
        return ServiceResult<ProfileDto>.Ok(dto);
    }
}
