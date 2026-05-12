using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.DTOs.Click;

public class ClickData
{
    public string IpAddress { get; set; } = null!;
    public string Referer { get; set; } = null!;
    public string UserAgent { get; set; } = null!;
    public string? DeviceType { get; set; }
    public string? Browser { get; set; }
    public string? OperatingSystem { get; set; }
}
