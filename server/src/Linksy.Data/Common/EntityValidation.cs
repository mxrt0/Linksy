using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Data.Common;

public static class EntityValidation
{
    public static class ApplicationUser
    {
        public const int UserNameMinLength = 3;
        public const int UserNameMaxLength = 30;
        public const string UserNamePattern = "^[a-zA-Z0-9_]+$";

        public const int EmailMaxLength = 254;
    }

    public static class Link
    {
        public const int OriginalUrlMaxLength = 2048;
        public const int ShortCodeMinLength = 3;
        public const int ShortCodeMaxLength = 20;
        public const string ShortCodePattern = "^[a-zA-Z0-9-]+$";
    }

    public static class Click
    {
        public const int IpAddressMaxLength = 45;
        public const int UserAgentMaxLength = 512;
        public const int RefererMaxLength = 2048;   
    }
}
