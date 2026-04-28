using Linksy.Data.Models;
using static Linksy.Data.Common.EntityValidation.Click;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Data.Configuration;

public class ClickConfiguration : IEntityTypeConfiguration<Click>
{
    public void Configure(EntityTypeBuilder<Click> builder)
    {
        builder
            .Property(c => c.IpAddress)
            .HasMaxLength(IpAddressMaxLength)
            .IsRequired();

        builder
            .Property(c => c.UserAgent)
            .HasMaxLength(UserAgentMaxLength)
            .IsRequired();

        builder
            .Property(c => c.Referer)
            .HasMaxLength(RefererMaxLength)
            .IsRequired();
    }
}
