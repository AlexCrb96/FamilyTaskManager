using System;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace KeepAliveFunctionApp
{
    public class KeepAlivePing
    {
        private readonly ILogger _logger;
        private readonly string _pingUrl;
        private static readonly HttpClient _httpClient = new HttpClient();

        public KeepAlivePing(ILoggerFactory loggerFactory, IConfiguration configuration)
        {
            _logger = loggerFactory.CreateLogger<KeepAlivePing>();
            _pingUrl = configuration["PING_URL"] ?? throw new ArgumentNullException("PING_URL environment variable is not set.");
        }

        [Function("KeepAlivePing")]
        public async Task Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer)
        {
            try
            {
                var response = await _httpClient.GetAsync(_pingUrl);
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync(); ;
                var healthInfo = HealthResponse.FromJson(content);

                _logger.LogInformation("Keep-alive ping status: DatabaseOk={DatabaseOk}, LastChecked={LastChecked} at {Time}",
                    healthInfo?.DatabaseOk,
                    healthInfo?.LastChecked,
                    DateTime.UtcNow);
            }
            catch
            {
                _logger.LogError("Keep-alive ping failed at {Time}", DateTime.UtcNow);
            }
        }
    }
}
