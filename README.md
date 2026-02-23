# weather-forecast-Project
latest project created

This website tells about the weather conditions of cities by 3 different modes:
1) by typing city name in city text box
2) by selecting city from past searched places.
3) by your device's current location.

WEATHER BY TYPING CITY NAME
> If the city entered is invalid, there will be a popup message displaying the error. If valid the user can see today's weather followed by 4 days upcoming weather in weather forecast tab
> the data shows humidity, Wind and current temperature of the city.
> It also chages the page background depending on today's weather (hot, cold or rainy).
> In case of today's temperature being greater than 40, a disclaimer message would be displayed.


WEATHER BY SELECTING ANY ITEM FROM DROP DOWN LIST
> This list wont be visible when opening for the first time on your machine.
> Every city's data searched will be showed in the drop down list with each city showing once even when searched mltiple times using the text box above.
> rest weather showing funcionality is same as the text box one.

TOGGLE BUTTON
> This button changes temperature format from degree celcius to farheneit and vice versa.

CURRENT LOCATION WEATHER
> Current Location Weather button takes permission to access devices location and bases on latitude and longitude of the device it access the weather using API call.
> After recieving the data it is displayed in respective areas.

This project uses combination of Tailwind and Vanilla CSS along with HTML and javascript.
Icons are used from FontAwesome website.
 OpenWeatherMap's API is used to collect data.
 Cities are stored in user's Local Storage

github link is : https://github.com/sana2990/weather-forecast-Project
