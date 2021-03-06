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
        //Promena ovih parametara
        private static readonly double COMaxCon = 0.8;
        private static readonly double NO2MaxCon = 40;
        private static readonly double SO2MaxCon = 2;
        private static readonly double AQIMax = 40;
        public AnalysisController()
        {
        }

        [HttpGet]
        public IActionResult GetMax()
        {
            MaxValues max = new MaxValues();
            max.COMaxCon = COMaxCon;
            max.NO2MaxCon = NO2MaxCon;
            max.SO2MaxCon = SO2MaxCon;
            max.AQIMax = AQIMax;
            return Ok(max);
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
                    double x = (data.CO_Con - COMaxCon) / COMaxCon * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    Warning warning=new Warning() { 
                    Text= "Too much CO in air"
                    };
                    System.Console.WriteLine(warning.Text);
                    StringContent warningContent=new StringContent(JsonConvert.SerializeObject(warning),Encoding.UTF8,"application/json");
                    await httpClient.PostAsync("http://notification:3001/publish/co",warningContent);
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
                    double x = (data.SO2_Con - SO2MaxCon) / SO2MaxCon * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    Warning warning=new Warning()
                    {
                        Text= "Too much SO2 in air"
                    };
                    System.Console.WriteLine(warning.Text);
                    StringContent warningContent=new StringContent(JsonConvert.SerializeObject(warning),Encoding.UTF8,"application/json");
                    await httpClient.PostAsync("http://notification:3001/publish/so2",warningContent);
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
                    double x = (data.NO2_Con - NO2MaxCon) / NO2MaxCon * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    Warning warning=new Warning() 
                    {
                        Text= "Too much NO2 in air"
                    };
                    System.Console.WriteLine(warning.Text);
                    StringContent warningContent=new StringContent(JsonConvert.SerializeObject(warning),Encoding.UTF8,"application/json");
                    await httpClient.PostAsync("http://notification:3001/publish/no2", warningContent);
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
                    double x = (data.CO_AQI + data.SO2_AQI + data.NO2_AQI - AQIMax) / AQIMax * 100 + 1;
                    if (x > 100)
                        x = 100;
                    actuator.Lvl = x;
                    var c = JsonConvert.SerializeObject(actuator);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    Warning warning=new Warning()
                    {
                        Text= "Too much air pollution AQI is high"
                    };
                    System.Console.WriteLine(warning.Text);
                    StringContent warningContent=new StringContent(JsonConvert.SerializeObject(warning), Encoding.UTF8,"application/json");
                    await httpClient.PostAsync("http://notification:3001/publish/aqi", warningContent);
                    using (var response = await httpClient.PutAsync("http://command/api/Command/cleaner/all", content))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                    }
                }
            }
            else{
               using (var httpClient = new HttpClient())
                {
                    Warning warning=new Warning()
                    {
                        Text= "AQI low"
                    };
                    StringContent warningContent=new StringContent(JsonConvert.SerializeObject(warning), Encoding.UTF8,"application/json");
                    await httpClient.PostAsync("http://notification:3001/publish/aqilow", warningContent);
                } 
            }

            using (var httpClient = new HttpClient()){
                Warning warning=new Warning()
                {
                    Text= "Actuators changed"
                };
                StringContent warningContent=new StringContent(JsonConvert.SerializeObject(warning), Encoding.UTF8,"application/json");
                await httpClient.PostAsync("http://notification:3001/actuator",warningContent);
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