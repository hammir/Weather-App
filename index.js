const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
let API_KEY="381fe652a432a409d34e31cbeae4de5e";
getFromSessionStorage();

//Initial variables required
let currentTab= userTab;

currentTab.classList.add("current-tab");

function switchTab(clickedTab)
{
    if(clickedTab!=currentTab)
        {
            currentTab.classList.remove("current-tab");
            currentTab=clickedTab;
            currentTab.classList.add("current-tab");

            if(!searchForm.classList.contains("active"))
                {
                    userInfoContainer.classList.remove("active");
                    grantAccessContainer.classList.remove("active");
                    searchForm.classList.add("active");

                }

            else
            {
                searchForm.classList.remove("active");
                userInfoContainer.classList.remove("active");
                getFromSessionStorage();


            }

        }

}

userTab.addEventListener("click", ()=> {
    //pass clicked tab as input parameter
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=> {
    //pass clicked tab as input parameter
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
        {
            grantAccessContainer.classList.add("active");
        }

    else
        {
            const coordinates=JSON.parse(localCoordinates);
            fetchUserWeatherInfo(coordinates);
        }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
//make grant container invisible
    grantAccessContainer.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    //API call

    try {
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
// console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    } 
    catch (error) {
        loadingScreen.classList.remove("active");
        alert("Error occured"+error);
    }
}



function renderWeatherInfo(weatherInfo)
{
//fetch elements 
 const cityName=document.querySelector("[data-cityName]");
 const countryIcon=document.querySelector("[data-countryIcon]");
 const desc=document.querySelector("[data-weatherDesc]");
 const weatherIcon=document.querySelector("[data-weatherIcon]");
 const temp=document.querySelector("[data-temp]");
 const windSpeed=document.querySelector("[data-windspeed]");
 const humidity=document.querySelector("[data-humidity]");
 const cloudiness=document.querySelector("[data-cloudiness]");
 const wrapperBackground = document.querySelector(".wrapper");

//fetch values from (API)weatherinfo object and put it in UI elements
cityName.innerText =weatherInfo?.name || 'Unknown';
if(weatherInfo?.sys?.country)
    {
        countryIcon.src =`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    }
    else{
        countryIcon.src ='./assets/no_image.jpg';
    }

desc.innerText= weatherInfo?.weather?.[0]?.description || 'No description available'; 
if(weatherInfo?.weather?.[0]?.icon)
    {
        weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    }
    else
    {
        weatherIcon.src = './assets/no_image.jpg';
    }

temp.innerText = weatherInfo?.main?.temp.toFixed(2) || 'N/A';
if(weatherInfo?.main?.temp>=33)
    {
        // wrapperBackground.style.background='rgb(255,252,25)';
        wrapperBackground.style.backgroundImage='linear-gradient(to right, #b87f0b, #bd8e0d, #c19d12, #c4ad1a, #c5bd24)';
    }
else if(weatherInfo?.main?.temp>=20 && weatherInfo?.main?.temp<33)
    {
        
        wrapperBackground.style.background= '#56CCF2';
        wrapperBackground.style.background='-webkit-linear-gradient(to right, #2F80ED, #56CCF2)';
        wrapperBackground.style.background = 'linear-gradient(to right, #2F80ED, #56CCF2)';
    }
else{
    wrapperBackground.style.backgroundImage = 'linear-gradient(160deg, #112d4e 0%, #3f72af 100%)';
}

windSpeed.innerText = weatherInfo?.wind?.speed.toFixed(2) || 'N/A';
humidity.innerText = weatherInfo?.main?.humidity || 'N/A';
cloudiness.innerText = weatherInfo?.clouds?.all || 'N/A';

// const cloudinessValue = weatherInfo?.clouds?.all || 0;
// if (cloudinessValue > 70) {
//     // Assuming high cloudiness indicates rain
//     desc.innerText += ' (likely rain)';
// }

}

function showPosition(position)
{
    const userCoordinates={
         lat: position.coords.latitude,
         lon: position.coords.longitude
    };
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

function getLocation()
{
    if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    else{
        alert("Location access not available");
    }
}

const grantAccessBtn = document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getLocation);



searchForm.addEventListener("submit", (e) => {

    e.preventDefault();
    
    console.log("Form submitted"); 
    
    let cityName = searchForm.querySelector("[data-searchInput]").value; // Retrieves the value entered into the input field
    
    console.log("City Name:", cityName); 
 
    if (cityName === "") {
         return; // If the input field is empty, do nothing
     } 
     
     else {
         fetchSearchWeatherInfo(cityName); // If the input field has a value, fetch weather information
     }
 });

async function fetchSearchWeatherInfo (city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        console.log(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    catch (error) {
        loadingScreen.classList.remove("active");
    alert("Error found"+error);    
    }

}


