using Linksy.Data.Repositories.Contracts;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core;

public class AnalyticsService(
    IClickRepository clickRepository,
    ILinkRepository linkRepository) : IAnalyticsService
{
    public async Task<ServiceResult<LinkAnalyticsDto>> GetLinkAnalyticsAsync(Guid linkId, int days = 30)
    {
        var link = await linkRepository.FirstOrDefaultAsync(l => l.Id == linkId);
        if (link is null)
        {
            return ServiceResult<LinkAnalyticsDto>.Fail("Link not found.");
        }

        var fromDate = DateTime.UtcNow.AddDays(-days);

        var clicks = clickRepository.GetByLinkId(linkId)
            .Where(c => c.ClickedAt >= fromDate);

        var grouped = await clicks
            .GroupBy(c => c.ClickedAt.Date)
            .Select(g => new DailyClicksDto
            {
                Date = g.Key,
                Count = g.Count()
            })
            .ToListAsync();

        var referrers = await clicks
            .GroupBy(c =>
                c.Referer.Contains("google") ? "Google" :
                c.Referer.Contains("twitter") ? "Twitter/X" :
                c.Referer.Contains("discord") ? "Discord" :
                c.Referer.Trim() == "qr" ? "QR" :
                string.IsNullOrWhiteSpace(c.Referer) ? "Direct" :
                "Other")
            .Select(g => new ReferrerStatDto
            {
                Source = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        var devices = await clicks
            .GroupBy(c => c.DeviceType ?? "Unknown")
            .Select(g => new DeviceStatDto
            {
                Device = g.Key,
                Count = g.Count()
            })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        var result = new LinkAnalyticsDto
        {
            LinkId = linkId,
            TotalClicks = clicks.Count(),
            ClicksByDay = grouped,
            Referrers = referrers,
            Devices = devices
        };

        return ServiceResult<LinkAnalyticsDto>.Ok(result);
    }
}
