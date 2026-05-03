using Linksy.Common;
using Linksy.Common.Enums;
using Linksy.Data.Models;
using Linksy.Data.Repositories.Contracts;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Linksy.Services.Core;
// TODO: Actual count of clicks, not 1
// TODO: GetLinksAsync implementation
public class LinkService(ILinkRepository linkRepository) : ILinkService
{
    private const int ShortCodeLength = 7;
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

    private LinkDto MapToDto(Link link)
    {
        return new LinkDto
        {
            Id = link.Id,
            ShortCode = link.ShortCode,
            OriginalUrl = link.OriginalUrl,
            ShortUrl = $"{AppConstants.ShortUrlBase}{link.ShortCode}",
            CreatedAt = link.CreatedAt,
            IsActive = link.IsActive,
            Clicks = 1//link.Clicks.Count
        };
    }

    private string GenerateShortCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        var sb = new StringBuilder(ShortCodeLength);

        for (int i = 0; i < ShortCodeLength; i++)
        {
            var index = RandomNumberGenerator.GetInt32(chars.Length);
            sb.Append(chars[index]);
        }

        return sb.ToString();
    }

    public async Task<ServiceResult<IEnumerable<LinkDto>>> GetLinksAsync(string userId)
    {
        var links = await linkRepository.GetAll()
            .Where(link => link.UserId == userId)
            .ToListAsync();

        var linkDtos = links.Select(MapToDto);

        return ServiceResult<IEnumerable<LinkDto>>.Ok(linkDtos);
    }
}