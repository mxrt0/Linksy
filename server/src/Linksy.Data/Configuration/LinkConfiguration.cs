using Linksy.Data.Models;
using static Linksy.Data.Common.EntityValidation.Link;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Data.Configuration;

public class LinkConfiguration : IEntityTypeConfiguration<Link>
{
    public void Configure(EntityTypeBuilder<Link> builder)
    {
        builder
            .Property(l => l.OriginalUrl)
            .HasMaxLength(OriginalUrlMaxLength)
            .IsRequired();

        builder
            .Property(l => l.ShortCode)
            .HasMaxLength(ShortCodeMaxLength)
            .IsRequired();

        builder
            .HasIndex(l => l.ShortCode)
            .IsUnique();

    }
}
