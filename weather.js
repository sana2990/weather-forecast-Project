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
let iserror = "";
const bodyElement = document.body;


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
        console.log(pos.coords.latitude, pos.coords.longitude);
        getWeatherbyLoc(lat,lon);
    });
});


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
            //console.log(data);
            return data;
        }

} catch(error){
    //console.log(error);
}
}


async function updateWeather(LocCity){
    try{
        let val = "";
        if(LocCity == ""){
            val = cityName.value || saved_cities_ddl.value;
        }
        else{
            val = LocCity;
        }
        
        if(val.length >0) {
            //cityName.value = val;
            let city_data = await getWeather(val);
            if(!city_data) {
                return;
            }
            else{
                let city = val.trim();
                if(city.length>0){
                    let cities = JSON.parse(localStorage.getItem("cities")) || [];
                    if(!cities.includes(city)){
                        console.log("citiies is " , cities)
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
    }
    catch(err) {
        alert(err);
    }
}