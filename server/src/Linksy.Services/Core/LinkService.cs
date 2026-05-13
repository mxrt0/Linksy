using Linksy.Common;
using Linksy.Common.Enums;
using Linksy.Data.Models;
using Linksy.Data.Repositories.Contracts;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Click;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using Linksy.Services.Results.Link;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using static Linksy.Data.Common.EntityValidation.Link;
namespace Linksy.Services.Core;
// TODO: Actual count of clicks, not 1

public class LinkService(ILinkRepository linkRepository, IClickRepository clickRepository) : ILinkService
{
    private const int GeneratedShortCodeLength = 7;
    private const int MaxRetryAttempts = 3;

    public async Task<ServiceResult<LinkDto>> CreateLinkAsync(CreateLinkRequest request, string userId)
    {
        DateTime? expiresAt = request.Expiry switch
        {
            LinkExpiry.Never => null,
            LinkExpiry.OneDay => DateTime.UtcNow.AddDays(1),
            LinkExpiry.SevenDays => DateTime.UtcNow.AddDays(7),
            LinkExpiry.ThirtyDays => DateTime.UtcNow.AddDays(30),
            _ => null
        };

        if (!string.IsNullOrWhiteSpace(request.ShortCode))
        {
            if (!Regex.IsMatch(request.ShortCode, ShortCodePattern))
            {
                return ServiceResult<LinkDto>.Fail("Short code must contain 3-20 alphanumeric (or '-') characters.");
            }

            var customLink = CreateLinkEntity(request.ShortCode, request, userId, expiresAt);

            try
            {
                await linkRepository.AddAsync(customLink);
                return ServiceResult<LinkDto>.Ok(MapToDto(customLink));
            }
            catch (DbUpdateException)
            {
                return ServiceResult<LinkDto>.Fail("Custom short code is already in use.");
            }
        }

        for (int i = 0; i < MaxRetryAttempts; i++)
        {
            var shortCode = GenerateShortCode();

            var link = CreateLinkEntity(shortCode, request, userId, expiresAt);

            try
            {
                await linkRepository.AddAsync(link);
                return ServiceResult<LinkDto>.Ok(MapToDto(link));
            }
            catch (DbUpdateException)
            {
                continue;
            }
        }

        return ServiceResult<LinkDto>.Fail("Failed to generate a unique short code. Please try again.");
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

        return new RedirectLinkResult(link.Id, link.OriginalUrl);
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
            Clicks = clickRepository.GetLinkClickCount(link.Id)
        };
    }

    private string GenerateShortCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        var sb = new StringBuilder(GeneratedShortCodeLength);

        for (int i = 0; i < GeneratedShortCodeLength; i++)
        {
            var index = RandomNumberGenerator.GetInt32(chars.Length);
            sb.Append(chars[index]);
        }

        return sb.ToString();
    }

}