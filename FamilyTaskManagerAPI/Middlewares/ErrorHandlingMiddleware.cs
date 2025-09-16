using FamilyTaskManagerAPI.DTOs.Responses;
using Microsoft.ApplicationInsights;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace FamilyTaskManagerAPI.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            using (_logger.BeginScope(new Dictionary<string, object>
            {
                ["RequestPath"] = context.Request.Path,
                ["RequestMethod"] = context.Request.Method,
            }))
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = new ErrorResponseDTO
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Error = "An unexpected error occurred.",
                Path = context.Request.Path,
                Timestamp = DateTime.UtcNow
            };

            var telemetry = context.RequestServices.GetRequiredService<TelemetryClient>();

            void TrackExceptionRecursive(Exception ex)
            {
                telemetry.TrackException(ex, new Dictionary<string, string>
                {
                    {"RequestPath", context.Request.Path },
                    {"RequestMethod", context.Request.Method },
                    {"InnerException", ex.InnerException?.ToString() ?? "None" }
                }, null);

                if (ex.InnerException != null)
                {
                    TrackExceptionRecursive(ex.InnerException);
                }
            }

            switch (exception)
            {
                case ValidationException validationEx:
                case ArgumentException argumentEx:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    response.Error = "One or more validation errors occured.";
                    response.ValidationErrors = new List<string> { exception.Message };
                    _logger.LogWarning("Validation error: {Message}", exception.Message);
                    TrackExceptionRecursive(exception);
                    break;

                case UnauthorizedAccessException unauthorizedEx:
                    response.StatusCode = (int)HttpStatusCode.Forbidden;
                    response.Error = "You are not authorized to perform this action.";
                    response.ValidationErrors = new List<string> { unauthorizedEx.Message };
                    _logger.LogWarning("Unauthorized access: {Message}", unauthorizedEx.Message);
                    TrackExceptionRecursive(exception);
                    break;

                case KeyNotFoundException notFoundEx:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    response.Error = "Resource not found.";
                    response.ValidationErrors = new List<string> { notFoundEx.Message };
                    _logger.LogWarning("Not found: {Message}", notFoundEx.Message);
                    TrackExceptionRecursive(exception);
                    break;

                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    response.Error = "An internal server error occurred.";
                    response.ValidationErrors = null;
                    _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
                    TrackExceptionRecursive(exception);
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)response.StatusCode;

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
