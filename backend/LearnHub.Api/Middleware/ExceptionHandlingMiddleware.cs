using System.Text.Json;

namespace LearnHub.Api.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try{ await _next(context); }
            catch (Exception ex)
            {
                var statusCode = ex switch
                {
                    KeyNotFoundException => StatusCodes.Status404NotFound,
                    UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                    ArgumentException => StatusCodes.Status400BadRequest,
                    _ => StatusCodes.Status500InternalServerError
                };

                context.Response.StatusCode = statusCode;
                context.Response.ContentType = "application/json";

                _logger.LogError(ex, "Error occurred for trace {traceId}", context.TraceIdentifier);
                
                var errorMessage = statusCode == StatusCodes.Status500InternalServerError 
                    ? "An unexpected error occurred" 
                    : ex.Message;

                await context.Response.WriteAsync(JsonSerializer.Serialize(new
                {
                    error = errorMessage,
                    traceId = context.TraceIdentifier
                }));
            }
        }
    }

    public static class ExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionHandlingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
