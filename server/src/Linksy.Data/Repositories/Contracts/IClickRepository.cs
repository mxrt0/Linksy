using Linksy.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Linksy.Data.Repositories.Contracts;

public interface IClickRepository
{
    Task AddAsync(Click click);
    int GetLinkClickCount(Guid linkId);
    Task<bool> AnyAsync(Expression<Func<Click, bool>> predicate);
    Task<Click?> FirstOrDefaultAsync(Expression<Func<Click, bool>> predicate);
}
