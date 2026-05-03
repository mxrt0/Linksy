using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Click;
using Linksy.Services.DTOs.Link;
using Linksy.Services.Results.Link;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Linksy.Api.Controllers;

[Authorize]
public class LinksController(ILinkService linkService) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<LinkDto>>> GetLinks()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await linkService.GetLinksAsync(userId);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result.Data);
    }

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

    [HttpPatch("{linkId}")]
    public async Task<ActionResult<LinkDto>> ToggleLinkActive(Guid linkId)
    {
        var result = await linkService.ToggleLinkActiveAsync(linkId);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return Ok(result.Data);
    }

    [HttpDelete("{linkId}")]
    public async Task<ActionResult> DeleteLink(Guid linkId)
    {
        var result = await linkService.DeleteLinkAsync(linkId);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return NoContent();
    }
}