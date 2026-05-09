using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Link;

public class LinkAnalyticsDto
{
    public Guid LinkId { get; set; }
    public int TotalClicks { get; set; }
    public List<DailyClicksDto> ClicksByDay { get; set; } = [];
    public List<ReferrerStatDto> Referrers { get; set; } = [];
}

public class ReferrerStatDto
{
    public string Source { get; set; } = null!;
    public int Count { get; set; }
}

public class DailyClicksDto
{
    public DateTime Date { get; set; }
    public int Count { get; set; }
}
