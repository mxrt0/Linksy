using Linksy.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Linksy.Data.Repositories.Contracts;

public interface ILinkRepository
{
    IQueryable<Link> GetAll();
    Task<Link?> ToggleActiveAsync(Guid linkId);
    Task AddAsync(Link link);
    Task UpdateAsync(Link link);
    Task<bool> DeleteAsync(Guid linkId);
    Task<bool> AnyAsync(Expression<Func<Link, bool>> predicate);
    Task<Link?> FirstOrDefaultAsync(Expression<Func<Link, bool>> predicate);
    Task<Link?> GetByShortCodeAsync(string shortCode);
}
