using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core.Contracts;

public interface ILinkService
{
    Task<ServiceResult<LinkDto>> CreateLinkAsync(CreateLinkRequest request, string userId);
}
