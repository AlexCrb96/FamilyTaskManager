using FamilyTaskManagerAPI.Data;
using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.DTOs.Responses;
using FamilyTaskManagerAPI.Entities;
using FamilyTaskManagerAPI.Middlewares;
using FamilyTaskManagerAPI.Services;
using FamilyTaskManagerAPI.Utils;
using FamilyTaskManagerAPI.Validators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);


#region Database

// Add DbContext for Entity Framework Core
builder.Services.AddDbContext<TaskManagerDbContext>(options =>
    // Use PostgreSQL
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("PostgreSQL_Connection"),
        npgsqlOptions => npgsqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorCodesToAdd: null)
        )
    );

#endregion

#region Authentication and Authorization

// Configure JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:Key"]))
        };
    });

// Init JwtSettings from environment variables or use user-secrets for development
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

#endregion

#region Mail Settings

// Init MailSettings from environment variables or use user-secrets for development
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));

#endregion

#region JSON Options

// Customize JSON serialization to handle enums as strings
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    { 
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

#endregion

#region Model Validation

// Customize the response for model validation errors
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
                                    .Where(e => e.Value.Errors.Count > 0)
                                    .SelectMany(e => e.Value.Errors.Select(er => er.ErrorMessage))
                                    .ToList();

        var response = new ErrorResponseDTO
        {
            StatusCode = (int)HttpStatusCode.BadRequest,
            Error = "One or more validation errors occurred.",
            ValidationErrors = errors,
            Path = context.HttpContext.Request.Path,
            Timestamp = DateTime.UtcNow
        };

        return new BadRequestObjectResult(response);
    };
});

#endregion

#region Dependency Injection

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<JwtProvider>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<TaskItemService>();
builder.Services.AddScoped(typeof(IRepository<,>), typeof(Repository<,>));
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<TaskItemValidator>();
builder.Services.AddScoped<UserValidator>();
builder.Services.AddScoped<TaskItemRepository>();
builder.Services.AddSingleton<MailService>();
builder.Services.AddHostedService<SystemHealthService>();

#endregion

#region Telemetry

// Add service for Azure Application Insights
builder.Services.AddApplicationInsightsTelemetry();

#endregion

#region CORS

// Configure CORS to allow requests from any origin (adjust as needed for production)
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>()
    ?? (Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")?
        .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        ?? Array.Empty<string>());

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
        else
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }            
    });
});

#endregion

#region Swagger

builder.Services.AddEndpointsApiExplorer();

// Configure Swagger to accept JWT tokens
builder.Services.AddSwaggerGen(options =>
{
    // Define the Bearer token security scheme
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Add the Bearer token security requirement so that Swagger UI includes the token in requests
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
    });
});

#endregion

var app = builder.Build();

#region Database Migration and Seeding

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<TaskManagerDbContext>();
        context.Database.Migrate();
        // Seed the database with an admin user if none exists
        await DatabaseSeeder.SeedAdminUser(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

#endregion

#region Middleware Pipeline

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

#endregion

app.Run();
