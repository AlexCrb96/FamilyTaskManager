using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace KeepAliveFunctionApp
{
    public class HealthResponse
    {
        public bool DatabaseOk { get; set; }
        public DateTime LastChecked { get; set; }

        public static HealthResponse FromJson(string json)
        {
            if (string.IsNullOrWhiteSpace(json))
            {
                return null;
            }

            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                return JsonSerializer.Deserialize<HealthResponse>(json, options);
            }
            catch
            {
                return null;
            }
        }
    }
}
