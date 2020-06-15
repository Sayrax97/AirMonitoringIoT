using Newtonsoft.Json;

namespace analytics.Models
{
    public class SensorData
    {
        [JsonProperty("CO_Con")]
        public double CO_Con { get; set; }

        [JsonProperty("CO_AQI")]
        public double CO_AQI { get; set; }

        [JsonProperty("SO2_Con")]
        public double SO2_Con { get; set; }
        [JsonProperty("SO2_AQI")]
        public double SO2_AQI { get; set; }
        [JsonProperty("NO2_Con")]
        public double NO2_Con { get; set; }
        [JsonProperty("NO2_AQI")]
        public double NO2_AQI { get; set; }
        [JsonProperty("sensorId")]
        public double sensorId { get; set; }
    }
}