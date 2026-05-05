using Linksy.Services.Core;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Click;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Linksy.Api.Controllers;

[AllowAnonymous]
[ApiController]
public class RedirectController(ILinkService linkService) : ControllerBase
{
    [HttpGet("r/{shortCode}")]
    public async Task<ActionResult> RedirectToUrl(string shortCode)
    {
        var result = await linkService.GetActiveLinkAsync(shortCode);
        if (!result.Success)
        {
            return NotFound(new { error = result.ErrorMessage });
        }

        var clickData = new ClickData
        {
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            UserAgent = Request.Headers["User-Agent"].ToString(),
            Referer = Request.Headers["Referer"].ToString()
        };

        await linkService.TrackClickAsync(result.Id!.Value, clickData);

        return Redirect(result.OriginalUrl!);
    }
}
