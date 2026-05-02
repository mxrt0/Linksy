using Linksy.Common.Enums;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Linksy.Api.Converters;

public class LinkExpiryJsonConverter : JsonConverter<LinkExpiry>
{
    public override LinkExpiry Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options)
    {
        var value = reader.GetString()?.ToLower();

        return value switch
        {
            "never" => LinkExpiry.Never,
            "1day" => LinkExpiry.OneDay,
            "7days" => LinkExpiry.SevenDays,
            "30days" => LinkExpiry.ThirtyDays,
            _ => throw new JsonException($"Invalid value for LinkExpiry: {value}")
        };
    }

    public override void Write(
        Utf8JsonWriter writer,
        LinkExpiry value,
        JsonSerializerOptions options)
    {
        var result = value switch
        {
            LinkExpiry.Never => "never",
            LinkExpiry.OneDay => "1day",
            LinkExpiry.SevenDays => "7days",
            LinkExpiry.ThirtyDays => "30days",

            _ => throw new JsonException()
        };

        writer.WriteStringValue(result);
    }
}
