using Linksy.Services.Core;
using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Click;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using Linksy.Services.Results.Link;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UAParser;

namespace Linksy.Api.Controllers;

[AllowAnonymous]
[Route("r")]
public class RedirectController(ILinkService linkService, IConfiguration config) : BaseController
{
    [HttpGet("{shortCode}")]
    public async Task<ActionResult> RedirectToUrl(string shortCode)
    {
        var frontendOrigin = config.GetValue<string>("Cors:AllowedOrigin");
        var result = await linkService.GetActiveLinkAsync(shortCode);

        if (!result.Success)
        {           
            var response = new { result.Success, error = result.ErrorMessage };
            return result.FailureReason switch
            {
                RedirectLinkFailureReason.NotFound
                    => Redirect($"{frontendOrigin}/not-found"),

                RedirectLinkFailureReason.Expired
                    => Redirect($"{frontendOrigin}/expired"),

                RedirectLinkFailureReason.Inactive
                    => Redirect($"{frontendOrigin}/not-found"),

                _ => BadRequest(response)
            };           
        }

        var userId = GetUserId();
        var isOwner = userId is not null && result.UserId == userId;

        if (result.IsPasswordProtected && !isOwner)
        {
            var cookieKey = $"lnk_auth_{shortCode}";
            var isUnlocked = Request.Cookies[cookieKey] == "true";

            if (!isUnlocked)
            {
                return Redirect($"{frontendOrigin}/r/{shortCode}/auth");
            }
        }
        return await ProcessRedirect(result.Id!.Value, result.OriginalUrl!);
    }


    [HttpPost("{shortCode}/unlock")]
    public async Task<ActionResult> VerifyPassword(string shortCode, [FromBody] UnlockRequest request)
    {
        var result = await linkService.VerifyPasswordAsync(shortCode, request.Password);

        if (!result.Success)
        {
            return Unauthorized(result);
        }

        Response.Cookies.Append($"lnk_auth_{shortCode}", "true", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddHours(12)
        });

        return Ok(); 
    }

    private async Task<ActionResult> ProcessRedirect(Guid linkId, string originalUrl)
    {
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

        var clickData = new ClickData
        {
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
            UserAgent = userAgent,
            Referer = referrer,
            DeviceType = deviceType,
            Browser = client.UA.Family,
            OperatingSystem = client.OS.Family
        };

        await linkService.TrackClickAsync(linkId, clickData);

        return Redirect(originalUrl);
    }
}
