using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using analytics.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace analytics.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class AnalysisController : ControllerBase
    {
        private static readonly double COMaxCon = 0.8;
        private static readonly double NO2MaxCon = 40;
        private static readonly double SO2MaxCon = 2;
        private static readonly double AQIMax = 40;
        public AnalysisController()
        {
        }

        [HttpGet]
        public ActionResult<string> Get()
        {
            return Ok("Analysis works!");
        }

        [HttpPost]
        public async Task<IActionResult> Post(SensorData data)
        {
            #region COcon
            if (data.CO_Con >= COMaxCon)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    actuator.Lvl = (data.CO_Con - COMaxCon) / COMaxCon * 100 + 1;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    System.Console.WriteLine("Too much CO in air");
                    using (var response = await httpClient.PutAsync("http://command/api/Command/co/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            else
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = false;
                    actuator.Lvl = 0;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                        System.Console.WriteLine("Air pollution not dangerous");
                    using (var response = await httpClient.PutAsync("http://command/api/Command/co/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            #endregion

            #region SO2Con
            if (data.SO2_Con >= SO2MaxCon)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    actuator.Lvl = (data.SO2_Con - SO2MaxCon) / SO2MaxCon * 100 + 1;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    System.Console.WriteLine("Too much SO2 in air");
                    using (var response = await httpClient.PutAsync("http://command/api/Command/so2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            else
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = false;
                    actuator.Lvl = 0;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                        System.Console.WriteLine("Air pollution not dangerous");
                    using (var response = await httpClient.PutAsync("http://command/api/Command/so2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            #endregion

            #region NO2Con
            if (data.NO2_Con >= NO2MaxCon)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    actuator.Lvl = (data.NO2_Con - NO2MaxCon) / NO2MaxCon * 100 + 1;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    System.Console.WriteLine("Too much NO2 in air");
                    using (var response = await httpClient.PutAsync("http://command/api/Command/no2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            else
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = false;
                    actuator.Lvl = 0;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                        System.Console.WriteLine("Air pollution not dangerous");
                    using (var response = await httpClient.PutAsync("http://command/api/Command/no2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            #endregion
            
            if (data.CO_AQI + data.SO2_AQI + data.NO2_AQI >= AQIMax)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    actuator.Lvl = (data.CO_AQI + data.SO2_AQI + data.NO2_AQI - AQIMax) / AQIMax * 100 + 1;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    System.Console.WriteLine("Too much air pollution AQI is high");
                    using (var response = await httpClient.PutAsync("http://command/api/Command/cleaner/all", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            return new JsonResult(
                new
                {
                    message = "Air pollution cleaner modifid"
                }
            );
        }
    }
}