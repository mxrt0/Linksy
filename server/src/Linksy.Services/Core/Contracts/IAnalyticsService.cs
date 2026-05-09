using Linksy.Services.DTOs.Link;
using Linksy.Services.Results;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core.Contracts;

public interface IAnalyticsService
{
    Task<ServiceResult<LinkAnalyticsDto>> GetLinkAnalyticsAsync(Guid linkId, int days = 30); 
}
