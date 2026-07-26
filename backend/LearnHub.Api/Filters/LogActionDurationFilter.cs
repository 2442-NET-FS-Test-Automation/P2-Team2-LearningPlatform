using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;


namespace LearnHub.Api.Filters;


public class LogActionDurationFilter : IActionFilter
{
    private readonly ILogger<LogActionDurationFilter> _logger;

    //constructor
    public LogActionDurationFilter(ILogger<LogActionDurationFilter> logger)
    {
        _logger = logger;
    }

    public void OnActionExecuting(ActionExecutingContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        context.HttpContext.Items["ActionStopwatch"] = stopwatch;
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        //validate if stopwatch in context items
        if(context.HttpContext.Items["ActionStopwatch"] is Stopwatch stopwatch)
        {
            stopwatch.Stop();

            var controller = context.RouteData.Values["controller"];
            var action = context.RouteData.Values["action"];
            var method = context.HttpContext.Request.Method;


            _logger.LogInformation(
                "Action {Controller}.{Action} {Method} took {ElapsedMs} ms",
                controller, action, method, stopwatch.ElapsedMilliseconds
            );
        }
    }
}