using Linksy.Data.Models;
using Linksy.Data.Repositories.Contracts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Linksy.Data.Repositories;

public class ClickRepository(ApplicationDbContext context) : IClickRepository
{
    public async Task AddAsync(Click click)
    {
        await context.Clicks.AddAsync(click);
        await context.SaveChangesAsync();
    }

    public async Task<bool> AnyAsync(Expression<Func<Click, bool>> predicate)
    {
        return await context.Clicks.AnyAsync(predicate);
    }

    public async Task<Click?> FirstOrDefaultAsync(Expression<Func<Click, bool>> predicate)
    {
        return await context.Clicks.FirstOrDefaultAsync(predicate); 
    }

    public int GetLinkClickCount(Guid linkId)
    {
        return context.Clicks.Count(c => c.LinkId == linkId);
    }
}
