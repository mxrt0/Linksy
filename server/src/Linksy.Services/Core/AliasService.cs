using Linksy.Common.Utilities;
using Linksy.Data.Common;
using Linksy.Data.Repositories.Contracts;
using Linksy.Services.Core.Contracts;
using Linksy.Services.Results.Alias;
using static Linksy.Data.Common.EntityValidation.Link;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Core;

public class AliasService(ILinkRepository repo) : IAliasService
{
    private const int MaxRetries = 10;

    private readonly string[] ReservedAliases =
        ["auth", "api", "admin", "r"];

    public async Task<AliasCheckResult> CheckAsync(string alias)
    {
        var normalized = Normalize(alias);

        if (string.IsNullOrWhiteSpace(normalized))
        {
            return AliasCheckResult.FailWithSuggestions(
                AliasUnavailableReason.InvalidFormat,
                AliasGenerator.GenerateFallbackSuggestions("link")
            );
        }

        if (!IsValidFormat(normalized))
        {
            return AliasCheckResult.FailWithSuggestions(
                AliasUnavailableReason.InvalidFormat,
                AliasGenerator.GenerateFallbackSuggestions("link")
            );
        }

        if (IsReserved(normalized))
        {
            return AliasCheckResult.FailWithSuggestions(
                AliasUnavailableReason.Reserved,
                AliasGenerator.GenerateFallbackSuggestions(normalized)
            );
        }

        if (normalized.Length < ShortCodeMinLength)
        {
            return AliasCheckResult.FailWithSuggestions(
                AliasUnavailableReason.TooShort,
                AliasGenerator.GenerateFallbackSuggestions(normalized)
            );
        }
        else if (normalized.Length > ShortCodeMaxLength)
        {
            return AliasCheckResult.FailWithSuggestions(
                AliasUnavailableReason.TooLong,
                AliasGenerator.GenerateFallbackSuggestions(normalized)
            );
        }

        var existingLink = await repo.GetByShortCodeAsync(normalized);

        if (existingLink is not null)
        {
            return AliasCheckResult.FailWithSuggestions(
                AliasUnavailableReason.Taken,
                await GenerateSuggestionsAsync(normalized)
            );
        }

        return AliasCheckResult.Available();
    }

    public async Task<string> GenerateUniqueAsync(string? baseAlias = null)
    {
        var baseValue = string.IsNullOrWhiteSpace(baseAlias)
            ? null
            : Normalize(baseAlias);

        for (int i = 0; i < MaxRetries; i++)
        {
            var candidate = baseValue != null
                ? $"{baseValue}-{AliasGenerator.GenerateRandom(4)}"
                : AliasGenerator.GenerateRandom();

            if (await repo.GetByShortCodeAsync(candidate) is null)
                return candidate;
        }

        throw new Exception("Failed to generate alias.");
    }

    public async Task<List<string>> GenerateSuggestionsAsync(string input)
    {
        var baseAlias = Normalize(input);

        var raw = new List<string>();
        raw.AddRange(AliasGenerator.GenerateDeterministic(baseAlias));
        raw.Add($"{baseAlias}-{DateTime.UtcNow.Year}");
        raw.Add($"{baseAlias}-{AliasGenerator.GenerateRandom(4)}");
        raw.Add(AliasGenerator.GenerateRandom(6));
        

        var result = new List<string>();

        foreach (var s in raw.Distinct())
        {
            if (await repo.GetByShortCodeAsync(s) is null)
                result.Add(s);

            if (result.Count == 5)
                break;
        }

        return result;
    }

    private bool IsReserved(string alias)
        => ReservedAliases.Contains(alias.ToLower());

    private bool IsValidFormat(string alias)
    {
        return alias.All(c =>
            char.IsLetterOrDigit(c) || c == '-');
    }

    private string Normalize(string input)
        => input.Trim().ToLower().Replace(" ", "-");

    public string GeneratePreviewAlias()
        => AliasGenerator.GenerateRandom();
}
