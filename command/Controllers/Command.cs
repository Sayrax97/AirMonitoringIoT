using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using analytics.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using command.Models;
using System.Text.Json.Serialization;

namespace command.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class CommandController : ControllerBase
    {
        private static readonly int TMax = 35;
        public CommandController()
        {
        }

        [HttpGet] 
        public ActionResult<string> Get() {
             return new ContentResult 
            {
                ContentType = "text/html",
                Content = "<h3>List of commands</h3><ul><li>PUT</li><li>co/cleaner - turn on/off (Switch:bool) and set Level (Lvl:int)</li><li>so2/cleaner- turn on/of f(Switch:bool) and set Level (Lvl:int)</li><li>no2/cleaner- turn on/of f(Switch:bool) and set Level (Lvl:int)</li></ul>"
            };
        }

        [HttpPut("co/cleaner")]
        public async Task<IActionResult> PutCoCleaner(Actuator data)
        {
                using (var httpClient = new HttpClient())
                {
                Sw sw = new Sw()
                {
                    Switch = data.Switch
                };
                    var c = JsonConvert.SerializeObject(sw);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://gateway:3000/co/cleaner", content))
                    {
                        string response1 = await response.Content.ReadAsStringAsync();
                    }
                }
                using (var httpClient = new HttpClient())
                {
                Level lv = new Level()
                {
                    Lvl = data.Lvl
                };
                    var c = JsonConvert.SerializeObject(lv);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://gateway:3000/co/cleaner/lvl", content))
                    {
                        string response2 = await response.Content.ReadAsStringAsync();
                    }
                }
                return Ok();
            
        }
        [HttpPut("so2/cleaner")]
        public async Task<IActionResult> PutSO2Cleaner(Actuator data)
        {
                using (var httpClient = new HttpClient())
                {
                Sw sw = new Sw()
                {
                    Switch = data.Switch
                };
                    var c = JsonConvert.SerializeObject(sw);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://gateway:3000/so2/cleaner", content))
                    {
                        string response1 = await response.Content.ReadAsStringAsync();
                    }
                }
                using (var httpClient = new HttpClient())
                {
                Level lv = new Level()
                {
                    Lvl = data.Lvl
                };
                    var c = JsonConvert.SerializeObject(lv);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://gateway:3000/so2/cleaner/lvl", content))
                    {
                        string response2 = await response.Content.ReadAsStringAsync();
                    }
                }
                return Ok();
            
        }
        [HttpPut("no2/cleaner")]
        public async Task<IActionResult> PutNO2Cleaner(Actuator data)
        {
                using (var httpClient = new HttpClient())
                {
                Sw sw = new Sw()
                {
                    Switch = data.Switch
                };
                    var c = JsonConvert.SerializeObject(sw);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://gateway:3000/no2/cleaner", content))
                    {
                        string response1 = await response.Content.ReadAsStringAsync();
                    }
                }
                using (var httpClient = new HttpClient())
                {
                Level lv = new Level()
                {
                    Lvl = data.Lvl
                };
                    var c = JsonConvert.SerializeObject(lv);
                    StringContent content = new StringContent(c, Encoding.UTF8, "application/json");
                    using (var response = await httpClient.PutAsync("http://gateway:3000/no2/cleaner/lvl", content))
                    {
                        string response2 = await response.Content.ReadAsStringAsync();
                    }
                }
                return Ok();
            
        }
    }
}