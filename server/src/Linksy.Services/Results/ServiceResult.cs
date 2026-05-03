using System;
using System.Collections.Generic;
using System.Text;

namespace Linksy.Services.Results;

public class ServiceResult<T> : ServiceResult
{
    private ServiceResult(): base() { } 
    public T? Data { get; private init; }

    public static ServiceResult<T> Ok(T data)
        => new ServiceResult<T> { Success = true, Data = data };
    public static new ServiceResult<T> Fail(string message)
        => new ServiceResult<T> { Success = false, Error = message };
}

public class ServiceResult
{
    protected ServiceResult() { }

    public bool Success { get; protected init; }
    public string? Error { get; protected init; }
    public static ServiceResult Ok()
        => new ServiceResult { Success = true };
    public static ServiceResult Fail(string message)
        => new ServiceResult { Success = false, Error = message };
}
