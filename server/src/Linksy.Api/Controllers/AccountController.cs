using Linksy.Services.Core.Contracts;
using Linksy.Services.DTOs.Profile;
using Linksy.Services.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Linksy.Api.Controllers;

[Authorize]
public class AccountController(IAccountService accountService) : BaseController
{
    [HttpGet("profile")]
    public async Task<ActionResult<ProfileDto>> GetProfile()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await accountService.GetUserProfileAsync(userId);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result.Data);
    }

    [HttpPut("profile")]
    public async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await accountService.UpdateUserProfileAsync(userId, request);
        if (!result.Success || result is not ServiceResult<ProfileDto> r)
        {
            return BadRequest(result);
        }
        else
        {
            return Ok(r.Data);
        }       
    }

    [HttpPut("password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await accountService.ChangeUserPasswordAsync(userId, request);
        if (!result.Success)
        {
            return BadRequest(result);
        }

        Response.Cookies.Append("jwt", "", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(-1)
        });
        return NoContent();
    }
}
