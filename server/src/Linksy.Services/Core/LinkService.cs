using Linksy.Common;
using Linksy.Common.Enums;
using Linksy.Common.Utilities;
using Linksy.Data.Models;
using Linksy.Data.Repositories.Contracts;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Click;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using Linksy.Services.Results.Link;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using static Linksy.Data.Common.EntityValidation.Link;
namespace Linksy.Services.Core;

public class LinkService(ILinkRepository linkRepository,
    IClickRepository clickRepository, IAliasService aliasService) : ILinkService
{
    private const int MaxRetryAttempts = 3;
    private readonly PasswordHasher<Link> _hasher = new();

    public async Task<ServiceResult<LinkDto>> CreateLinkAsync(
    CreateLinkRequest request,
    string userId)
    {
        DateTime? expiresAt = request.Expiry switch
        {
            LinkExpiry.Never => null,
            LinkExpiry.OneDay => DateTime.UtcNow.AddDays(1),
            LinkExpiry.SevenDays => DateTime.UtcNow.AddDays(7),
            LinkExpiry.ThirtyDays => DateTime.UtcNow.AddDays(30),
            _ => null
        };

        string finalShortCode;

        if (!string.IsNullOrWhiteSpace(request.ShortCode))
        {
            var normalized = request.ShortCode.Trim();

            var check = await aliasService.CheckAsync(normalized);

            if (!check.IsAvailable)
            {
                return ServiceResult<LinkDto>.Fail(
                    check.Reason?.ToString() ?? "Invalid alias",
                    check.Suggestions
                );
            }

            finalShortCode = normalized;
        }
        else
        {
            finalShortCode = await aliasService.GenerateUniqueAsync();
        }

        var link = CreateLinkEntity(finalShortCode, request, userId, expiresAt);

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            link.PasswordHash = _hasher.HashPassword(link, request.Password);
        }

        try
        {
            await linkRepository.AddAsync(link);
            return ServiceResult<LinkDto>.Ok(MapToDto(link));
        }
        catch (DbUpdateException)
        {
            link.ShortCode = await aliasService.GenerateUniqueAsync(link.ShortCode);

            await linkRepository.AddAsync(link);
            return ServiceResult<LinkDto>.Ok(MapToDto(link));
        }
    }
    private Link CreateLinkEntity(string shortCode,
        CreateLinkRequest request,
        string userId, DateTime? expiresAt)
    {
        return new Link
        {
            Id = Guid.NewGuid(),
            ShortCode = shortCode,
            OriginalUrl = request.OriginalUrl,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt,
            IsActive = true
        };
    }

    public async Task<ServiceResult<IEnumerable<LinkDto>>> GetLinksAsync(string userId)
    {
        var links = await linkRepository.GetAll()
            .Where(link => link.UserId == userId)
            .ToListAsync();

        var linkDtos = links.Select(MapToDto);

        return ServiceResult<IEnumerable<LinkDto>>.Ok(linkDtos);
    }

    public async Task<ServiceResult<LinkDto>> ToggleLinkActiveAsync(Guid linkId)
    {
        var link = await linkRepository.ToggleActiveAsync(linkId);

        if (link is null)
        {
            return ServiceResult<LinkDto>.Fail("Link not found.");
        }

        return ServiceResult<LinkDto>.Ok(MapToDto(link));
    }

    public async Task<ServiceResult<LinkDto>> UpdateLinkAsync(
        Guid linkId,
        UpdateLinkRequest request,
        string userId)
    {
        var link = await linkRepository.FirstOrDefaultAsync(
            l => l.Id == linkId && l.UserId == userId);

        if (link is null)
        {
            return ServiceResult<LinkDto>.Fail("Link not found.");
        }

        var requestedShortCode = request.ShortCode.Trim();

        if (!string.Equals(link.ShortCode, requestedShortCode, StringComparison.OrdinalIgnoreCase))
        {
            var aliasCheck = await aliasService.CheckAsync(requestedShortCode);

            if (!aliasCheck.IsAvailable)
            {
                return ServiceResult<LinkDto>.Fail(
                    aliasCheck.Reason?.ToString() ?? "Invalid alias",
                    aliasCheck.Suggestions
                );
            }

            link.ShortCode = requestedShortCode;
        }

        link.OriginalUrl = request.OriginalUrl;
        link.ExpiresAt = request.Expiry switch
        {
            LinkExpiry.Never => null,
            LinkExpiry.OneDay => DateTime.UtcNow.AddDays(1),
            LinkExpiry.SevenDays => DateTime.UtcNow.AddDays(7),
            LinkExpiry.ThirtyDays => DateTime.UtcNow.AddDays(30),
            _ => null
        };
        link.IsActive = request.IsActive;
        link.UpdatedAt = DateTime.UtcNow;

        if (request.RemovePassword)
        {
            link.PasswordHash = null;
        }
        else if (!string.IsNullOrWhiteSpace(request.Password))
        {
            link.PasswordHash = _hasher.HashPassword(link, request.Password);
        }

        await linkRepository.UpdateAsync(link);

        return ServiceResult<LinkDto>.Ok(MapToDto(link));
    }

    public async Task<ServiceResult> DeleteLinkAsync(Guid linkId)
    {
        var success = await linkRepository.DeleteAsync(linkId);

        if (!success)
        {
            return ServiceResult.Fail("Link not found.");
        }

        return ServiceResult.Ok();
    }

    public async Task<RedirectLinkResult> GetActiveLinkAsync(string shortCode)
    {
        var link = await linkRepository.GetByShortCodeAsync(shortCode);

        if (link is null)
            return new RedirectLinkResult(RedirectLinkFailureReason.NotFound);

        if (!link.IsActive)
            return new RedirectLinkResult(RedirectLinkFailureReason.Inactive);

        if (link.ExpiresAt.HasValue && link.ExpiresAt.Value <= DateTime.UtcNow)
            return new RedirectLinkResult(RedirectLinkFailureReason.Expired);

        bool isPasswordProtected = !string.IsNullOrWhiteSpace(link.PasswordHash);
        return new RedirectLinkResult(link.Id, link.UserId, link.OriginalUrl, isPasswordProtected, link.ShortCode);
    }

    public async Task<ServiceResult> TrackClickAsync(Guid linkId, ClickData data)
    {
        var click = new Click
        {
            Id = Guid.NewGuid(),
            LinkId = linkId,
            ClickedAt = DateTime.UtcNow,
            IpAddress = data.IpAddress,
            Referer = data.Referer,
            UserAgent = data.UserAgent,
            DeviceType = data.DeviceType,
            Browser = data.Browser,
            OperatingSystem = data.OperatingSystem
        };

        await clickRepository.AddAsync(click);
        return ServiceResult.Ok();
    }

    private LinkDto MapToDto(Link link)
    {
        return new LinkDto
        {
            Id = link.Id,
            ShortCode = link.ShortCode,
            OriginalUrl = link.OriginalUrl,
            ShortUrl = $"{AppConstants.ShortUrlBase}{link.ShortCode}",
            CreatedAt = link.CreatedAt,
            ExpiresAt = link.ExpiresAt,
            IsActive = link.IsActive,
            Clicks = clickRepository.GetLinkClickCount(link.Id),
            IsPasswordProtected = !string.IsNullOrWhiteSpace(link.PasswordHash)
        };
    }

    

    public async Task<ServiceResult<LinkDto>> VerifyPasswordAsync(string shortCode, string password)
    {
        var link = await linkRepository.GetByShortCodeAsync(shortCode);

        if (link is null)
        {
            return ServiceResult<LinkDto>.Fail("Link not found.");
        }

        if (string.IsNullOrWhiteSpace(link.PasswordHash))
        {
            return ServiceResult<LinkDto>.Ok(MapToDto(link));
        }

        var result = _hasher.VerifyHashedPassword(link, link.PasswordHash, password);

        if (result == PasswordVerificationResult.Success)
        {
            return ServiceResult<LinkDto>.Ok(MapToDto(link));
        }

        return ServiceResult<LinkDto>.Fail("Invalid password.");
    }
}
