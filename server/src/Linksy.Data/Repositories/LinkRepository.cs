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

    public async Task<bool> DeleteAsync(Guid linkId)
    {
        var link = await FirstOrDefaultAsync(l => l.Id == linkId);

        if (link == null)
        {
            return false;
        }

        context.Links.Remove(link);

        await context.SaveChangesAsync();
        return true;
    }

    public async Task<Link?> FirstOrDefaultAsync(Expression<Func<Link, bool>> predicate)
    {
        return await context.Links.FirstOrDefaultAsync(predicate);
    }

    public IQueryable<Link> GetAll() => context.Links.AsNoTracking();

    public async Task<Link?> ToggleActiveAsync(Guid linkId)
    {
        var link = await FirstOrDefaultAsync(x => x.Id == linkId);

        if (link == null) 
            return null;

        link.IsActive = !link.IsActive;

        await context.SaveChangesAsync();

        return link;
    }
}
