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
            HttpStatusCode code = HttpStatusCode.InternalServerError;
            string resultMessage = "An unexpected error occurred.";
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
                    code = HttpStatusCode.BadRequest;
                    resultMessage = validationEx.Message;
                    _logger.LogWarning("Validation error: {Message}", validationEx.Message);
                    TrackExceptionRecursive(exception);
                    break;

                case ArgumentException argumentEx:
                    code = HttpStatusCode.BadRequest;
                    resultMessage = argumentEx.Message;
                    _logger.LogWarning("Argument error: {Message}", argumentEx.Message);
                    TrackExceptionRecursive(exception);
                    break;

                case UnauthorizedAccessException unauthorizedEx:
                    code = HttpStatusCode.Forbidden;
                    resultMessage = unauthorizedEx.Message;
                    _logger.LogWarning("Unauthorized access: {Message}", unauthorizedEx.Message);
                    TrackExceptionRecursive(exception);
                    break;

                case KeyNotFoundException notFoundEx:
                    code = HttpStatusCode.NotFound;
                    resultMessage = notFoundEx.Message;
                    _logger.LogWarning("Not found: {Message}", notFoundEx.Message);
                    TrackExceptionRecursive(exception);
                    break;

                default:
                    code = HttpStatusCode.InternalServerError;
                    resultMessage = "An internal server error occurred.";
                    _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);
                    TrackExceptionRecursive(exception);
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            var response = new { 
                error = resultMessage,
                statusCode = (int)code
            };

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
