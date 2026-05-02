using Linksy.Data.Models;
using Linksy.Data.Repositories.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Linksy.Data.Repositories;

public class LinkRepository(ApplicationDbContext context) : ILinkRepository
{
    public async Task AddAsync(Link link)
    {
        await context.Links.AddAsync(link);
        await context.SaveChangesAsync();
    }

    public async Task<bool> AnyAsync(Expression<Func<Link, bool>> predicate)
    {
        return await context.Links.AnyAsync(predicate);
    }
}
