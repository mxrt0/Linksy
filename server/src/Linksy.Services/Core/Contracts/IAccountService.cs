using Linksy.Services.DTOs.Profile;
using Linksy.Services.Results;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core.Contracts;

public interface IAccountService
{
    Task<ServiceResult<ProfileDto>> GetUserProfileAsync(string userId);
    Task<ServiceResult> UpdateUserProfileAsync(string userId, UpdateProfileRequest request);
    Task<ServiceResult> ChangeUserPasswordAsync(string userId, ChangePasswordRequest request);
}
