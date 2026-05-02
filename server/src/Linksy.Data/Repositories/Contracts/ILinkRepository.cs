using Linksy.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Data.Repositories.Contracts;

public interface ILinkRepository
{
    Task AddAsync(Link link);
}
