using Linksy.Services.DTOs.Click;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using Linksy.Services.Results.Link;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core.Contracts;

public interface ILinkService
{
    Task<ServiceResult<LinkDto>> CreateLinkAsync(CreateLinkRequest request, string userId);
    Task<ServiceResult<IEnumerable<LinkDto>>> GetLinksAsync(string userId);
    Task<ServiceResult<LinkDto>> UpdateLinkAsync(Guid linkId, UpdateLinkRequest request, string userId);
    Task<ServiceResult<LinkDto>> ToggleLinkActiveAsync(Guid linkId);
    Task<ServiceResult> DeleteLinkAsync(Guid linkId);
    Task<RedirectLinkResult> GetActiveLinkAsync(string shortCode);
    Task<ServiceResult> TrackClickAsync(Guid linkId, ClickData data);
    Task<ServiceResult<LinkDto>> VerifyPasswordAsync(string shortCode, string password); 
}
