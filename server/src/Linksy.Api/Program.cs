using Linksy.Data;
using Linksy.Data.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Reflection.Metadata.Ecma335;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        x => x.MigrationsAssembly("Linksy.Data")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var allowedOrigin = builder.Configuration["Cors:AllowedOrigin"] 
    ?? throw new InvalidOperationException("CORS allowed origin is not configured.");

builder.Services.AddCors(options =>
{
    options.AddPolicy("vite@client", policy =>
    {
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("Jwt");

    var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] 
        ?? throw new InvalidOperationException("JWT key is not configured."));

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.ContainsKey("jwt"))
            {
                context.Token = context.Request.Cookies["jwt"];
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("vite@client");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

