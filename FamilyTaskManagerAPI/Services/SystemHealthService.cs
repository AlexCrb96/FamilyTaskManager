using FamilyTaskManagerAPI.Data.Repositories;
using FamilyTaskManagerAPI.Entities;


namespace FamilyTaskManagerAPI.Services
{
    public class SystemHealthService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<SystemHealthService> _logger;

        public static bool LastDbPingSuccessful { get; private set; } = false;
        public static DateTime LastDbPingTime { get; private set; } = DateTime.MinValue;

        public SystemHealthService(IServiceScopeFactory scopeFactory, ILogger<SystemHealthService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SystemHealthService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var _repo = scope.ServiceProvider.GetRequiredService<IRepository<User, string>>();

                        LastDbPingSuccessful = await _repo.PingAsync(stoppingToken);
                        LastDbPingTime = DateTime.UtcNow;
                    }                    

                    _logger.LogInformation("DB ping successful at {time}", LastDbPingTime);
                }
                catch
                {
                    LastDbPingSuccessful = false;
                    LastDbPingTime = DateTime.UtcNow;

                    _logger.LogInformation("DB ping failed at {time}", LastDbPingTime);
                }

                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }

            _logger.LogInformation("SystemHealthService stopped.");
        }
    }
}