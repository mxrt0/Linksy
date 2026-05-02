using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Link;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Linksy.Api.Controllers;

[Authorize]
public class LinksController(ILinkService linkService) : BaseController
{
    [HttpPost]
    public async Task<ActionResult<LinkDto>> CreateLink(CreateLinkRequest request)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await linkService.CreateLinkAsync(request, userId);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result.Data);
    }
}