using Linksy.Data.Repositories.Contracts;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
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

        var grouped = clicks
            .GroupBy(c => c.ClickedAt.Date)
            .Select(g => new DailyClicksDto
            {
                Date = g.Key,
                Count = g.Count()
            })
            .ToList();

        var result = new LinkAnalyticsDto
        {
            LinkId = linkId,
            TotalClicks = clicks.Count(),
            ClicksByDay = grouped
        };

        return ServiceResult<LinkAnalyticsDto>.Ok(result);
    }
}
