//getting all document objects

const APIKey = "296f44370427f37fda72bf9a718eb344";
const cityName = document.querySelector("#cityName");
const curr_city = document.querySelector("#city");
const temperature = document.querySelector("#temp");
const toggle_btn = document.querySelector("#toggle_btn");
const air_stat = document.querySelector("#wind_speed");
const feels_like = document.querySelector("#feels_like");
const wind_deg = document.querySelector("#deg");
const forecast_div = document.querySelector(".forecast");
const popUpDiv = document.querySelector("#customPopUp");
const popupPara = document.querySelector("#popupMessagepara");
const popupClose = document.querySelector("#closePopup_btn")
const user_Location = document.querySelector("#location")
const option_ddl = document.querySelector("#cities_ddl")
const savedCitiesArea = document.querySelector("#saved_cities");
const saved_cities_ddl = document.querySelector("#cities_ddl")
let loc_city = "";
let iserror = "";
const bodyElement = document.body;

//set local storage key to store cities
if (!localStorage.getItem("cities")) {
    localStorage.setItem("cities", JSON.stringify([]));
}

popUpDiv.classList.add("hideCustomPopUp");
cityName.addEventListener("change", updateWeather);
toggle_btn.addEventListener("click", changeTemperatureFormat);
document.addEventListener("DOMContentLoaded", showSavedCities);
saved_cities_ddl.addEventListener("change", updateWeather);
popupClose.addEventListener("click", () => {
    popUpDiv.classList.remove("showCustomPopUp");
    popUpDiv.classList.add("customPopUp");
})
user_Location.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        //console.log(pos.coords.latitude, pos.coords.longitude);
        getWeatherbyLoc(lat,lon);
    });
});

//asynchronous function to get weather via API call
async function getWeather(city){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`);

        const data = await response.json()
        //console.log(response);
        if(!response.ok){
            //console.log("error found is: ", data.statusText);
            //alert(data.statusText);
            
            let msg = data.cod +" : " + data.message;
            iserror += msg;
            showPopUp(msg);
            return null;
        }
        else{
            console.log(data);
            return data;
        }

} catch(error){
    //console.log(error);
}
}

//function to update divs with new data as per changed inputs
async function updateWeather() {
    try{
        let val = "";
        if(loc_city == ""){
            val = cityName.value || saved_cities_ddl.value;
        }
        else{
            val = loc_city;
        }
        
        if(val.length >0) {
            //cityName.value = val;
            let city_data = await getWeather(val);
            if(!city_data) {
                showPopUp("city name not found");
                return;
            }
            else{
                let city = val.trim();
                if(city.length>0){
                    let cities = JSON.parse(localStorage.getItem("cities")) || [];
                    if(!cities.includes(city)){
                        //console.log("citiies is " , cities)
                        cities.push(city);
                        localStorage.setItem("cities", JSON.stringify(cities));
                    }
                    showSavedCities();
                }
                else{
                    savedCitiesArea.classList.add("saved_cities");
                }
                curr_city.innerHTML = val;
                temperature.textContent = city_data.main.temp + "°C";
                air_stat.textContent = "wind speed: " + city_data.wind.speed + "kph";
                feels_like.innerHTML = "feels like: " + city_data.main.feels_like + "C";
                wind_deg.innerHTML = "degree: " + city_data.wind.deg;

                if(city_data.main.temp>=21 && city_data.main.temp<36) {
                    bodyElement.style.backgroundImage = 'url("./images/sunny_bg.gif")';
                }
                else if(city_data.main.temp<21){
                    bodyElement.style.backgroundImage = 'url("./images/coldweather.gif")';
                }
                else if(city_data.main.temp>=36){
                    bodyElement.style.backgroundImage = 'url("./images/verySunnybg.gif")';
                }
                get5dayForecast(val);
                cityName.value=""
                saved_cities_ddl.selectedIndex = 0;
            }
        }
        else{
            showPopUp("City Name can't be empty");
        }
        val = "";
    }
    catch(err) {
        showPopUp(err);
    }
}

//function to change Temperature format when clicked
function changeTemperatureFormat() {
    if(temperature.innerHTML != ""){
        if(temperature.textContent.includes("°C")) {
            let old_temp = temperature.textContent.split("°")[0];
            let new_temp = (old_temp *9/5) + 32;
            temperature.innerHTML = new_temp + "°F";
        }
        else if(temperature.innerHTML.includes("°F")) {
            let old_temp = temperature.textContent.split("°")[0];
            let new_temp = (old_temp -32) * 5/9;
            temperature.innerHTML = (new_temp) + "°C"
        }
    } else{
        showPopUp("Temperature not provided")
    }
}

//asunchronous function to get forecast data
async function get5dayForecast(city) {
    try{
        forecast_div.innerHTML="";

        const extendedDays_res = await fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`);
        const extendedDays_data = await extendedDays_res.json();
        //console.log("extended days data is: ", extendedDays_data);
        const today = new Date().getDate();
        let dailyforecast = extendedDays_data.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .filter(item => new Date(item.dt_txt).getDate() !== today);
        //console.log("daily forecast is: ", dailyforecast);
       dailyforecast.forEach(perDay => {
        let parent_div = document.createElement("div");
        parent_div.classList.add("forecast_parent")
        let day = document.createElement("p");
        let temp_img = "";
        let temp = document.createElement("p");

        //for temperature
        //console.log("per day temp is: " , perDay.main.temp);
        

        //for temperature display image
        if(perDay.main.temp < 20){
            temp_img = '<i class="fa-solid fa-snowflake"></i>'
            temp.innerHTML = perDay.main.temp + "°C" + temp_img;
            
        }
        else if(perDay.main.temp>=20 && perDay.main.temp<=30) {
            temp_img = '<i class="fa-regular fa-sun"></i>';
            temp.innerHTML = perDay.main.temp + "°C" + temp_img;
        }
        else {
            temp_img = '<i class="fa-solid fa-sun"></i>';
            temp.innerHTML = perDay.main.temp + "°C" + temp_img;
        }

        

        //for day according to the date
        let date_day = perDay.dt_txt.split(" ")[0];
        let dateObj = new Date(date_day);
        let dayIndex = dateObj.getDay();

        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

        let dayName = days[dayIndex];
        day.innerHTML = dayName;

        parent_div.append(day, temp);
        forecast_div.append(parent_div);
       });
    } catch(error){
        showPopUp(error);
    }
    
}

//function toshow custom popup in case of error
function showPopUp(message) {
    if(message!= "") {
        popupPara.textContent = message;
        popUpDiv.classList.remove("customPopUp");
        popUpDiv.classList.add("showCustomPopUp");
        /*setTimeout(() => {
            popUpDiv.classList.remove("showCustomPopUp");
        popUpDiv.classList.add("customPopUp");
    }, 3000);*/
    }
}

//function to show saved cities from local storage if any
function showSavedCities(){
    let saved_cities = JSON.parse(localStorage.getItem("cities")) || [];
    console.log("saved cities on load are: ", saved_cities);
    if(saved_cities.length>0) {
        //let savedCitiesArea = document.querySelector("#saved_cities");
        savedCitiesArea.classList.add("showSavedCities");
        //savedCitiesArea.classList.add("showSavedCities");
        console.log("class name is ", savedCitiesArea.className);
         option_ddl.innerHTML = '<option value="">Select Item</option>'

    //const saved_cities = JSON.parse( localStorage.getItem("cities")) || [];
    //console.log("saved cities are: ", saved_cities);
    saved_cities.forEach(city_saved => {
        console.log(city_saved);
        let option = document.createElement("option");
        option.innerHTML = city_saved;
        option.value = city_saved;
        option_ddl.appendChild(option);
    });
    }
    else {
        savedCitiesArea.classList.add("saved_cities")
    }
}

//function to get weather based on location of the device.
async function getWeatherbyLoc(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`;

  try{
    const responseLoc = await fetch(url);
    const dataLoc = await responseLoc.json();
    //console.log(dataLoc);
    //console.log(dataLoc.name);

    if (dataLoc.cod == 200){
        loc_city = dataLoc.name;
        console.log("city name is : ", loc_city);
        updateWeather();
    }
    else{
        showPopUp("error identidying device's location.");
    }
  }
  catch(err) {
    showPopUp(err);
  }
}