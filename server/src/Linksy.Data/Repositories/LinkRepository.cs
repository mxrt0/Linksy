using Linksy.Data.Models;
using Linksy.Data.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Data.Repositories;

public class LinkRepository(ApplicationDbContext context) : ILinkRepository
{
    public async Task AddAsync(Link link)
    {
        await context.Links.AddAsync(link);
        await context.SaveChangesAsync();
    }
}
