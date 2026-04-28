using Linksy.Data.Models;
using static Linksy.Data.Common.EntityValidation.ApplicationUser;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Data.Configuration;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder
            .Property(u => u.UserName)
            .HasMaxLength(UserNameMaxLength);

        builder
            .Property(u => u.Email)
            .HasMaxLength(EmailMaxLength);
    }
}
