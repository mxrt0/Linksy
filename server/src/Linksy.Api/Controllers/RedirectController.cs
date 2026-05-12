using Linksy.Services.Core;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Click;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UAParser;

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

        var referrer = Request.Headers["Referer"].ToString();
        
        if (string.IsNullOrWhiteSpace(referrer))
        {
            referrer = Request.Query["source"] == "qr" ? "qr" : string.Empty;
        }

        var parser = Parser.GetDefault();
        var userAgent = Request.Headers["User-Agent"].ToString();
        var client = parser.Parse(userAgent);

        string? deviceType = null;
        var os = client.OS.Family?.ToLower() ?? "";

        if (os.Contains("ios") || os.Contains("android"))
        {
            deviceType = "Mobile";
        }
        else
        {
            deviceType = "Desktop";
        }
        Console.WriteLine($"UA: {userAgent}");
        Console.WriteLine($"Device: {client.Device.Family}");
        Console.WriteLine($"OS: {client.OS.Family}");
        var clickData = new ClickData
        {
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            UserAgent = userAgent,
            Referer = referrer,
            DeviceType = deviceType,
            Browser = client.UA.Family,
            OperatingSystem = client.OS.Family
        };

        await linkService.TrackClickAsync(result.Id!.Value, clickData);

        return Redirect(result.OriginalUrl!);
    }
}
