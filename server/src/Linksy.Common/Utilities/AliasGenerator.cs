using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace Linksy.Common.Utilities;

public static class AliasGenerator
{
    private const int GeneratedAliasLength = 7;
    public static string GenerateRandom(int length = GeneratedAliasLength)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        var sb = new StringBuilder(length);

        for (int i = 0; i < length; i++)
        {
            var index = RandomNumberGenerator.GetInt32(chars.Length);
            sb.Append(chars[index]);
        }

        return sb.ToString();
    }
    public static List<string> GenerateDeterministic(string baseAlias)
    {
        return new List<string>
        {
            baseAlias,
            $"{baseAlias}-1",
            $"{baseAlias}-link",
            $"{baseAlias}-official",
            $"{baseAlias}-app",
            $"{baseAlias}-io"
        };
    }

    public static List<string> GenerateTimeBased(string baseAlias)
    {
        return new List<string>
        {
            $"{baseAlias}-{DateTime.UtcNow.Year}",
            $"{baseAlias}-{DateTime.UtcNow.Year % 2000}"
        };
    }

    public static List<string> GenerateFallbackSuggestions(string baseAlias)
    {
        return new List<string>
        {
            $"{baseAlias}-{DateTime.UtcNow.Day.ToString().PadLeft(2, '0')}{DateTime.UtcNow.Month.ToString().PadLeft(2, '0')}",
            $"{baseAlias}-{GenerateRandom(4)}",
            $"{baseAlias}-{GenerateRandom(4)}"
        };
    }
}
