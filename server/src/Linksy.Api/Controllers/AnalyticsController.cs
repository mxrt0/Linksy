using Linksy.Services.Core.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Linksy.Api.Controllers;

public class AnalyticsController(IAnalyticsService analyticsService) : BaseController
{
    [HttpGet("{linkId:guid}")]
    public async Task<ActionResult> GetLinkAnalytics(Guid linkId)
    {
        var result = await analyticsService.GetLinkAnalyticsAsync(linkId);  

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result.Data);  
    }
}
