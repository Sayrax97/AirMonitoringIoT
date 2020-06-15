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
            if (data.CO_Con >= COMaxCon)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    double x = (data.CO_Con - COMaxCon) / COMaxCon * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://command/api/command/co/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        System.Console.WriteLine("Too much air pollution");
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
                    using (var response = await httpClient.PutAsync("http://command/api/command/co/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        System.Console.WriteLine("Air pollution not dangerous");
                    }
                }
            }
            if (data.SO2_Con >= SO2MaxCon)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    double x = (data.SO2_Con - SO2MaxCon) / SO2MaxCon * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://command/api/command/so2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        System.Console.WriteLine("Too much air pollution");
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
                    using (var response = await httpClient.PutAsync("http://command/api/command/so2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        System.Console.WriteLine("Air pollution not dangerous");
                    }
                }
            }
            if (data.NO2_Con >= NO2MaxCon)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    double x = (data.NO2_Con - NO2MaxCon) / NO2MaxCon * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://command/api/command/no2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        System.Console.WriteLine("Too much air pollution");
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
                    using (var response = await httpClient.PutAsync("http://command/api/command/no2/cleaner", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        System.Console.WriteLine("Air pollution not dangerous");
                    }
                }
            }
            if (data.CO_AQI + data.SO2_AQI + data.NO2_AQI >= AQIMax)
            {
                using (var httpClient = new HttpClient())
                {
                    Actuator actuator = new Actuator();
                    actuator.Switch = true;
                    double x = (data.CO_AQI + data.SO2_AQI + data.NO2_AQI - AQIMax) / AQIMax * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://command/api/command/cleaner/all", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        System.Console.WriteLine("Too much air pollution");
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